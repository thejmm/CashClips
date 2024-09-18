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

    let customerEmail = "";
    let userId = "";
    if (session.customer && typeof session.customer !== "string") {
      const { data: userData, error: userError } = await supabase
        .from("auth.users")
        .select("email, id")
        .eq("stripe_customer_id", session.customer.id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
        return res.status(404).json({ error: "User not found" });
      }
      customerEmail = userData.email;
      userId = userData.id;
    }

    let subscriptionStatus = null;
    let subscriptionId = null;
    if (session.subscription && typeof session.subscription !== "string") {
      subscriptionStatus = session.subscription.status;
      subscriptionId = session.subscription.id;
    }

    let paymentStatus = null;
    if (session.payment_intent && typeof session.payment_intent !== "string") {
      paymentStatus = session.payment_intent.status;
    }

    if (userId) {
      const { error: userDataError } = await supabase.from("user_data").upsert(
        {
          user_id: userId,
          subscription_status: subscriptionStatus,
          next_billing_date:
            session.subscription && typeof session.subscription !== "string"
              ? new Date(
                  session.subscription.current_period_end * 1000,
                ).toISOString()
              : null,
        },
        { onConflict: "user_id" },
      );

      if (userDataError) {
        console.error("Error updating user_data:", userDataError);
      }

      if (subscriptionId) {
        const { error: subscriptionError } = await supabase
          .from("subscriptions")
          .upsert(
            {
              id: subscriptionId,
              user_id: userId,
              status: subscriptionStatus,
            },
            { onConflict: "id" },
          );

        if (subscriptionError) {
          console.error("Error updating subscription:", subscriptionError);
        }
      }
    }

    res.status(200).json({
      status: session.status,
      customer_email: customerEmail,
      subscription_status: subscriptionStatus,
      payment_status: paymentStatus,
    });
  } catch (err: any) {
    console.error("Error retrieving checkout session:", err);
    res.status(err.statusCode || 500).json({ error: err.message });
  }
}
