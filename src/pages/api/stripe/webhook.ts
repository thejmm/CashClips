// src/pages/api/stripe/webhook.ts
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import { buffer } from "micro";
import createClient from "@/utils/supabase/api";

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
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await handleSubscriptionChange(
          event.data.object as Stripe.Subscription,
          supabase,
        );
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
        await handleInvoicePayment(
          event.data.object as Stripe.Invoice,
          supabase,
        );
        break;
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
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

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  supabase: any,
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
      userError,
    );
    throw new Error(`No user found for Stripe customer ${customerId}`);
  }

  const { error: subscriptionError } = await supabase
    .from("subscriptions")
    .upsert(
      {
        id: subscription.id,
        user_id: userData.user_id,
        status: subscription.status,
        price_id: subscription.items.data[0].price.id,
        quantity: subscription.items.data[0].quantity,
        cancel_at_period_end: subscription.cancel_at_period_end,
        created_at: new Date(subscription.created * 1000).toISOString(),
        current_period_start: new Date(
          subscription.current_period_start * 1000,
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000,
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
      { onConflict: "id" },
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
        subscription.current_period_end * 1000,
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
      userError,
    );
    throw new Error(`No user found for Stripe customer ${customerId}`);
  }

  const { error: invoiceError } = await supabase.from("invoices").upsert(
    {
      id: invoice.id,
      stripe_invoice_id: invoice.id,
      user_id: userData.user_id,
      subscription_id: invoice.subscription,
      status: invoice.status,
      currency: invoice.currency,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      amount_remaining: invoice.amount_remaining,
      created: new Date(invoice.created * 1000).toISOString(),
      period_start: new Date(invoice.period_start * 1000).toISOString(),
      period_end: new Date(invoice.period_end * 1000).toISOString(),
    },
    { onConflict: "stripe_invoice_id" },
  );

  if (invoiceError) {
    console.error("Error upserting invoice:", invoiceError);
    throw invoiceError;
  }

  if (invoice.subscription) {
    const { error: subscriptionError } = await supabase
      .from("subscriptions")
      .update({ status: invoice.status === "paid" ? "active" : "past_due" })
      .eq("id", invoice.subscription);

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
  supabase: any,
) {
  if (session.mode === "subscription") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );
    await handleSubscriptionChange(subscription, supabase);
  }

  if (session.invoice) {
    const invoice = await stripe.invoices.retrieve(session.invoice as string);
    await handleInvoicePayment(invoice, supabase);
  }

  if (session.metadata?.supabase_user_id) {
    const { error: userDataError } = await supabase
      .from("user_data")
      .update({
        plan_name: session.metadata.plan_name,
        plan_price: session.amount_total,
        subscription_status: "active",
      })
      .eq("user_id", session.metadata.supabase_user_id);

    if (userDataError) {
      console.error("Error updating user_data after checkout:", userDataError);
      throw userDataError;
    }
  }
}
