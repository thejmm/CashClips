// src/pages/api/stripe/checkout-sessions.ts
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import createClient from "@/utils/supabase/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).end("Method Not Allowed");
  }

  const { session_id } = req.query;
  if (!session_id || typeof session_id !== "string") {
    return res.status(400).json({ error: "Invalid session_id" });
  }

  const supabase = createClient(req, res);

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer", "subscription", "payment_intent"],
    });

    if (!session.metadata?.supabase_user_id) {
      return res.status(400).json({ error: "Invalid session metadata" });
    }

    const userId = session.metadata.supabase_user_id;

    let subscriptionStatus: string | null = null;
    let subscriptionId: string | null = null;
    let nextBillingDate: string | null = null;
    let priceId: string | null = null;
    let quantity: number | null = null;

    if (session.subscription && typeof session.subscription !== "string") {
      const subscription = session.subscription;
      subscriptionStatus = subscription.status;
      subscriptionId = subscription.id;
      nextBillingDate = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;
      priceId = subscription.items.data[0]?.price.id || null;
      quantity = subscription.items.data[0]?.quantity || null;

      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .upsert(
          {
            stripe_subscription_id: subscriptionId,
            user_id: userId,
            status: subscriptionStatus,
            price_id: priceId,
            quantity: quantity,
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
          { onConflict: "stripe_subscription_id" },
        );

      if (subscriptionError) {
        console.error("Error updating subscription:", subscriptionError);
      }
    }

    let paymentStatus: string | null = null;
    if (session.payment_intent && typeof session.payment_intent !== "string") {
      paymentStatus = session.payment_intent.status;
    }

    const { error: userDataError } = await supabase.from("user_data").upsert(
      {
        user_id: userId,
        stripe_customer_id: session.customer as string,
        plan_name: session.metadata.plan_name,
        plan_price: session.amount_total || 0,
        subscription_status: subscriptionStatus || "active",
        next_billing_date: nextBillingDate,
        total_credits: parseInt(session.metadata.total_credits || "0", 10),
        used_credits: 0,
        promotekit_referral: session.metadata.promotekit_referral || null,
      },
      { onConflict: "user_id" },
    );

    if (userDataError) {
      console.error("Error updating user_data:", userDataError);
    }

    res.status(200).json({
      status: session.status,
      subscription_status: subscriptionStatus,
      payment_status: paymentStatus,
    });
  } catch (err: any) {
    console.error("Error retrieving checkout session:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
