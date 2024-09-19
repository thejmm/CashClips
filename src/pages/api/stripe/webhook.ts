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
  res: NextApiResponse
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
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
          supabase
        );
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        await handleInvoicePayment(
          event.data.object as Stripe.Invoice,
          supabase
        );
        break;
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
          supabase
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

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  supabase: any
) {
  const customerId = subscription.customer as string;
  const { data: userData, error: userError } = await supabase
    .from("user_data")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (userError) {
    console.error(
      `No user found for Stripe customer ${customerId}:`,
      userError
    );
    throw new Error(`No user found for Stripe customer ${customerId}`);
  }

  const priceId = subscription.items.data[0]?.price.id;

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert(
      {
        stripe_subscription_id: subscription.id,
        user_id: userData.user_id,
        status: subscription.status,
        price_id: priceId,
        quantity: subscription.items.data[0].quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        created_at: new Date(subscription.created * 1000).toISOString(),
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
        ended_at: subscription.ended_at
          ? new Date(subscription.ended_at * 1000).toISOString()
          : null,
        cancel_at: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : null,
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      },
      { onConflict: "stripe_subscription_id" }
    );

  if (subscriptionError) {
    console.error("Error upserting subscription:", subscriptionError);
    throw subscriptionError;
  }

  const { error: userDataError } = await supabase
    .from("user_data")
    .update({
      subscription_status: subscription.status,
      next_billing_date: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
    })
    .eq("user_id", userData.user_id);

  if (userDataError) {
    console.error("Error updating user_data:", userDataError);
    throw userDataError;
  }
}

async function handleInvoicePayment(invoice: Stripe.Invoice, supabase: any) {
  const customerId = invoice.customer as string;
  const { data: userData, error: userError } = await supabase
    .from("user_data")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (userError) {
    console.error(
      `No user found for Stripe customer ${customerId}:`,
      userError
    );
    throw new Error(`No user found for Stripe customer ${customerId}`);
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
    }
  );

  if (invoiceError) {
    console.error("Error upserting invoice:", invoiceError);
    throw invoiceError;
  }

  if (invoice.subscription) {
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .update({ status: invoice.status === "paid" ? "active" : "past_due" })
      .eq("stripe_subscription_id", invoice.subscription);

    if (subscriptionError) {
      console.error("Error updating subscription status:", subscriptionError);
      throw subscriptionError;
    }

    const { error: userDataError } = await supabase
      .from("user_data")
      .update({
        subscription_status: invoice.status === "paid" ? "active" : "past_due",
      })
      .eq("user_id", userData.user_id);

    if (userDataError) {
      console.error("Error updating user_data status:", userDataError);
      throw userDataError;
    }
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session,
  supabase: any
) {
  if (session.payment_status !== "paid") {
    console.log("Checkout session not paid. Skipping user data update.");
    return;
  }

  if (session.mode === "subscription" && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await handleSubscriptionChange(subscription, supabase);
  }

  if (session.invoice) {
    const invoice = await stripe.invoices.retrieve(session.invoice as string);
    await handleInvoicePayment(invoice, supabase);
  }

  if (session.metadata) {
    const { supabase_user_id, plan_name } = session.metadata;

    if (supabase_user_id && plan_name) {
      const planDetails = pricingConfig.plans.find((p) => p.name === plan_name);
      if (!planDetails) {
        console.error("Invalid plan name in session metadata:", plan_name);
        return;
      }

      const totalCreditsMatch = planDetails.features[0].match(
        /Generate (\d+) clips per month/
      );
      if (!totalCreditsMatch) {
        console.error("Unable to parse total credits from plan features");
        return;
      }

      const totalCredits = parseInt(totalCreditsMatch[1], 10);

      const { error: userDataError } = await supabase.from("user_data").upsert(
        {
          user_id: supabase_user_id,
          plan_name: plan_name,
          plan_price: session.amount_total,
          subscription_status: "active",
          total_credits: totalCredits,
          used_credits: 0,
        },
        { onConflict: "user_id" }
      );

      if (userDataError) {
        console.error(
          "Error updating user_data after checkout:",
          userDataError
        );
        throw userDataError;
      }
    } else {
      console.error("Missing required metadata in checkout session");
    }
  } else {
    console.error("No metadata found in checkout session");
  }
}
