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

    let userId = "";
    if (session.customer && typeof session.customer !== "string") {
      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("user_id")
        .eq("stripe_customer_id", session.customer.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        return res.status(404).json({ error: "User not found" });
      }
      userId = userData.user_id;
    }

    let subscriptionStatus: string | null = null;
    let subscriptionId: string | null = null;
    let nextBillingDate: string | null = null;
    let priceId: string | null = null;
    let quantity: number | null = null;
    let cancelAtPeriodEnd: boolean | null = null;
    let createdAt: string | null = null;
    let currentPeriodStart: string | null = null;
    let currentPeriodEnd: string | null = null;
    let trialStart: string | null = null;
    let trialEnd: string | null = null;
    let endedAt: string | null = null;
    let cancelAt: string | null = null;
    let canceledAt: string | null = null;

    if (session.subscription && typeof session.subscription !== "string") {
      const subscription = session.subscription;
      subscriptionStatus = subscription.status;
      subscriptionId = subscription.id;
      nextBillingDate = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;

      // Retrieve all necessary fields
      priceId = subscription.items.data[0]?.price.id || null;
      quantity = subscription.items.data[0]?.quantity || null;
      cancelAtPeriodEnd = subscription.cancel_at_period_end || false;
      createdAt = subscription.created
        ? new Date(subscription.created * 1000).toISOString()
        : null;
      currentPeriodStart = subscription.current_period_start
        ? new Date(subscription.current_period_start * 1000).toISOString()
        : null;
      currentPeriodEnd = subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null;
      trialStart = subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null;
      trialEnd = subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null;
      endedAt = subscription.ended_at
        ? new Date(subscription.ended_at * 1000).toISOString()
        : null;
      cancelAt = subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null;
      canceledAt = subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null;
    }

    let paymentStatus: string | null = null;
    if (session.payment_intent && typeof session.payment_intent !== "string") {
      paymentStatus = session.payment_intent.status;
    }

    if (userId) {
      const { error: userDataError } = await supabase
        .from("user_data")
        .update({
          subscription_status: subscriptionStatus,
          next_billing_date: nextBillingDate,
        })
        .eq("user_id", userId);

      if (userDataError) {
        console.error("Error updating user_data:", userDataError);
      }

      if (
        subscriptionId &&
        priceId &&
        quantity !== null &&
        createdAt &&
        currentPeriodStart &&
        currentPeriodEnd
      ) {
        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              stripe_subscription_id: subscriptionId,
              user_id: userId,
              status: subscriptionStatus,
              price_id: priceId,
              quantity: quantity, // Ensure quantity is provided
              cancel_at_period_end: cancelAtPeriodEnd,
              created_at: createdAt,
              current_period_start: currentPeriodStart,
              current_period_end: currentPeriodEnd,
              ended_at: endedAt,
              cancel_at: cancelAt,
              canceled_at: canceledAt,
              trial_start: trialStart,
              trial_end: trialEnd,
            },
            { onConflict: "stripe_subscription_id" },
          );

        if (subscriptionError) {
          console.error("Error updating subscription:", subscriptionError);
        }
      } else {
        console.error(
          "Missing required fields for updating subscription: subscriptionId, priceId, quantity, createdAt, currentPeriodStart, or currentPeriodEnd",
        );
      }
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
