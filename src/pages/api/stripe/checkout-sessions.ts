// src/pages/api/stripe/checkout-sessions.ts
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import createClient from "@/utils/supabase/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    console.log("Retrieving session:", session_id);
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer", "subscription", "payment_intent"],
    });
    console.log("Session retrieved:", session.id);

    if (!session.customer || typeof session.customer === "string") {
      return res.status(400).json({ error: "Invalid customer data" });
    }

    let { data: userData, error: userError } = await supabase
      .from("user_data")
      .select("*")
      .eq("stripe_customer_id", session.customer.id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return res.status(500).json({ error: "Error fetching user data" });
    }

    let subscriptionData = null;
    if (session.subscription && typeof session.subscription !== "string") {
      const subscription = session.subscription;
      subscriptionData = {
        stripe_subscription_id: subscription.id,
        user_id: userData.user_id,
        status: subscription.status,
        price_id: subscription.items.data[0]?.price.id,
        quantity: subscription.items.data[0]?.quantity,
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
      };

      const { error: subscriptionError } = await supabase
        .from("subscriptions")
        .upsert(subscriptionData, { onConflict: "stripe_subscription_id" });

      if (subscriptionError) {
        console.error("Error updating subscription:", subscriptionError);
      } else {
        console.log("Subscription updated successfully");
      }
    }

    let paymentStatus = null;
    if (session.payment_intent && typeof session.payment_intent !== "string") {
      paymentStatus = session.payment_intent.status;
    }

    const updatedUserData = {
      subscription_status:
        subscriptionData?.status || userData.subscription_status,
      next_billing_date:
        subscriptionData?.current_period_end || userData.next_billing_date,
      total_credits: session.metadata?.total_credits
        ? parseInt(session.metadata.total_credits)
        : userData.total_credits,
    };

    const { error: userDataError } = await supabase
      .from("user_data")
      .update(updatedUserData)
      .eq("user_id", userData.user_id);

    if (userDataError) {
      console.error("Error updating user_data:", userDataError);
    } else {
      console.log("User data updated successfully");
    }

    res.status(200).json({
      status: session.status,
      subscription_status:
        subscriptionData?.status || userData.subscription_status,
      payment_status: paymentStatus,
      user_data: {
        ...userData,
        ...updatedUserData,
      },
    });
  } catch (err: any) {
    console.error("Error retrieving checkout session:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
