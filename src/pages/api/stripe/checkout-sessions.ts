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
  if (req.method === "GET") {
    const { session_id } = req.query;
    const supabase = createClient(req, res);

    try {
      const session = await stripe.checkout.sessions.retrieve(
        session_id as string,
        {
          expand: ["customer", "subscription", "payment_intent"],
        },
      );

      let customerEmail = "";
      if (session.customer && typeof session.customer !== "string") {
        const { data: userData, error: userError } = await supabase
          .from("auth.users")
          .select("email")
          .eq("stripe_customer_id", session.customer.id)
          .single();

        if (userError) {
          throw new Error("User not found");
        }
        customerEmail = userData.email;
      }

      let subscriptionStatus = null;
      if (session.subscription && typeof session.subscription !== "string") {
        subscriptionStatus = session.subscription.status;
      }

      let paymentStatus = null;
      if (
        session.payment_intent &&
        typeof session.payment_intent !== "string"
      ) {
        paymentStatus = session.payment_intent.status;
      }

      res.status(200).json({
        status: session.status,
        customer_email: customerEmail,
        subscription_status: subscriptionStatus,
        payment_status: paymentStatus,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", "GET");
    res.status(405).end("Method Not Allowed");
  }
}
