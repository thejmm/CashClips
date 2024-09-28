// src/pages/api/stripe/webhook.ts
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import { buffer } from "micro";
import createClient from "@/utils/supabase/api";
import { pricingConfig } from "@/components/landing/pricing";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed:`, err);
    return res
      .status(400)
      .json({ error: "Webhook signature verification failed" });
  }

  const supabase = createClient(req, res);

  try {
    switch (event.type) {
      case "customer.updated":
        await handleCustomerUpdated(
          event.data.object as Stripe.Customer,
          supabase,
        );
        break;
      case "customer.deleted":
        await handleCustomerDeleted(
          event.data.object as Stripe.Customer,
          supabase,
        );
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
          supabase,
        );
        break;
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          supabase,
        );
        break;
      case "invoice.paid":
        await handleInvoicePayment(
          event.data.object as Stripe.Invoice,
          supabase,
        );
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
    res.json({ received: true });
  } catch (err) {
    console.error(`Error processing webhook:`, err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function handleCustomerUpdated(customer: Stripe.Customer, supabase: any) {
  console.log(`Handling customer update for: ${customer.id}`);
  const { error: userDataError } = await supabase
    .from("user_data")
    .update({
      stripe_customer_id: customer.id,
    })
    .eq("stripe_customer_id", customer.id);

  if (userDataError) {
    console.error("Error updating user_data:", userDataError);
    throw userDataError;
  }
  console.log(`Customer ${customer.id} updated successfully`);
}

async function handleCustomerDeleted(customer: Stripe.Customer, supabase: any) {
  console.log(`Handling customer deletion for: ${customer.id}`);
  const { error: userDataError } = await supabase
    .from("user_data")
    .update({
      stripe_customer_id: null,
      subscription_status: "canceled",
      stripe_subscription_id: null,
    })
    .eq("stripe_customer_id", customer.id);

  if (userDataError) {
    console.error("Error updating user_data:", userDataError);
    throw userDataError;
  }

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .update({ status: "canceled" })
    .eq("stripe_customer_id", customer.id);

  if (subscriptionError) {
    console.error("Error updating subscription:", subscriptionError);
    throw subscriptionError;
  }
  console.log(`Customer ${customer.id} deleted successfully`);
}

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  supabase: any,
) {
  console.log(`Handling subscription change for: ${subscription.id}`);
  const customerId = subscription.customer as string;

  const { data: userData, error: userError } = await supabase
    .from("user_data")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (userError) {
    console.error(
      `No user found for Stripe customer ${customerId}:`,
      userError,
    );
    throw new Error(`No user found for Stripe customer ${customerId}`);
  }

  const subscriptionData = {
    id: uuidv4(),
    user_id: userData.user_id,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: customerId,
    status: subscription.status,
    plan_id: subscription.items.data[0].price.id,
    current_period_start: new Date(
      subscription.current_period_start * 1000,
    ).toISOString(),
    current_period_end: new Date(
      subscription.current_period_end * 1000,
    ).toISOString(),
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
    cancel_at: subscription.cancel_at
      ? new Date(subscription.cancel_at * 1000).toISOString()
      : null,
    ended_at: subscription.ended_at
      ? new Date(subscription.ended_at * 1000).toISOString()
      : null,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
  };

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert(subscriptionData, { onConflict: "stripe_subscription_id" });

  if (subscriptionError) {
    console.error("Error upserting subscription:", subscriptionError);
    throw subscriptionError;
  }

  const { error: userDataError } = await supabase
    .from("user_data")
    .update({
      subscription_status: subscription.status,
      next_billing_date: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      current_period_start: new Date(
        subscription.current_period_start * 1000,
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      stripe_subscription_id: subscription.id,
    })
    .eq("user_id", userData.user_id);

  if (userDataError) {
    console.error("Error updating user_data:", userDataError);
    throw userDataError;
  }
  console.log(`Subscription ${subscription.id} updated successfully`);
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any,
) {
  console.log("Handling completed checkout session:", session.id);

  if (session.payment_status !== "paid") {
    console.log("Checkout session not paid. Skipping user data update.");
    return;
  }

  if (!session.metadata) {
    console.error("No metadata found in checkout session");
    return;
  }

  const { supabase_user_id, plan_name, total_credits } = session.metadata;

  if (!supabase_user_id || !plan_name || !total_credits) {
    console.error("Missing required metadata in checkout session");
    return;
  }

  try {
    let subscription: Stripe.Subscription | null = null;
    if (session.subscription && typeof session.subscription === "string") {
      subscription = await stripe.subscriptions.retrieve(session.subscription);
    }

    if (subscription) {
      const subscriptionData = {
        id: uuidv4(),
        user_id: supabase_user_id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: session.customer as string,
        status: subscription.status,
        plan_id: subscription.items.data[0].price.id,
        current_period_start: new Date(
          subscription.current_period_start * 1000,
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000,
        ).toISOString(),
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        cancel_at: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : null,
        ended_at: subscription.ended_at
          ? new Date(subscription.ended_at * 1000).toISOString()
          : null,
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      };

      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .upsert(subscriptionData, { onConflict: "stripe_subscription_id" });

      if (subscriptionError) {
        console.error("Error upserting subscription:", subscriptionError);
        throw subscriptionError;
      }
    }

    const { data: userData, error: userDataError } = await supabase
      .from("user_data")
      .upsert(
        {
          user_id: supabase_user_id,
          stripe_customer_id: session.customer as string,
          plan_name: plan_name,
          plan_price: session.amount_total,
          subscription_status: subscription ? subscription.status : "active",
          total_credits: parseInt(total_credits),
          used_credits: 0,
          next_billing_date: subscription
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          current_period_start: subscription
            ? new Date(subscription.current_period_start * 1000).toISOString()
            : null,
          current_period_end: subscription
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null,
          canceled_at: subscription?.canceled_at
            ? new Date(subscription.canceled_at * 1000).toISOString()
            : null,
          trial_start: subscription?.trial_start
            ? new Date(subscription.trial_start * 1000).toISOString()
            : null,
          trial_end: subscription?.trial_end
            ? new Date(subscription.trial_end * 1000).toISOString()
            : null,
          stripe_subscription_id: subscription ? subscription.id : null,
        },
        { onConflict: "user_id" },
      )
      .select();

    if (userDataError) {
      throw userDataError;
    }

    console.log("User data updated:", userData);
    console.log("User data and subscription updated successfully");
  } catch (error) {
    console.error("Error updating user data or subscription:", error);
    throw error;
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice, supabase: any) {
  console.log(`Handling invoice payment for: ${invoice.id}`);
  const customerId = invoice.customer as string;

  const { data: userData, error: userError } = await supabase
    .from("user_data")
    .select("user_id, stripe_customer_id, plan_name")
    .eq("stripe_customer_id", customerId)
    .single();

  if (userError) {
    console.error(
      `No user found for Stripe customer ${customerId}:`,
      userError,
    );
    throw new Error(`No user found for Stripe customer ${customerId}`);
  }

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string,
  );
  const planId = subscription.items.data[0].price.id;

  const matchedPlan = pricingConfig.plans.find(
    (plan) =>
      plan.stripePriceId.month === planId || plan.stripePriceId.year === planId,
  );

  if (!matchedPlan) {
    console.error("Plan not found for ID:", planId);
    throw new Error("Unknown plan ID");
  }

  const newTotalCredits = parseInt(matchedPlan.features[0].split(" ")[1]);

  const { error: userDataUpdateError } = await supabase
    .from("user_data")
    .update({
      used_credits: 0, // Reset credits
      total_credits: newTotalCredits, // Update total credits
      plan_name: matchedPlan.name,
      plan_price: matchedPlan.monthlyPrice, // Adjust based on the current plan
      subscription_status: invoice.status === "paid" ? "active" : "past_due",
      next_billing_date: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
      current_period_start: new Date(
        subscription.current_period_start * 1000,
      ).toISOString(),
      current_period_end: new Date(
        subscription.current_period_end * 1000,
      ).toISOString(),
    })
    .eq("user_id", userData.user_id);

  if (userDataUpdateError) {
    console.error("Error updating user data:", userDataUpdateError);
    throw userDataUpdateError;
  }

  const { error: invoiceError } = await supabase.from("invoices").upsert(
    {
      id: uuidv4(),
      stripe_invoice_id: invoice.id,
      user_id: userData.user_id,
      stripe_subscription_id: invoice.subscription,
      status: invoice.status,
      currency: invoice.currency,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      amount_remaining: invoice.amount_remaining,
      created: new Date(invoice.created * 1000).toISOString(),
      period_start: new Date(invoice.period_start * 1000).toISOString(),
      period_end: new Date(invoice.period_end * 1000).toISOString(),
    },
    {
      onConflict: "stripe_invoice_id",
      update: [
        "status",
        "amount_due",
        "amount_paid",
        "amount_remaining",
        "updated_at",
      ],
    },
  );

  if (invoiceError) {
    console.error("Error upserting invoice:", invoiceError);
    throw invoiceError;
  }

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .update({ status: invoice.status === "paid" ? "active" : "past_due" })
    .eq("stripe_subscription_id", invoice.subscription);

  if (subscriptionError) {
    console.error("Error updating subscription status:", subscriptionError);
    throw subscriptionError;
  }

  console.log(`Invoice ${invoice.id} processed successfully`);
}
