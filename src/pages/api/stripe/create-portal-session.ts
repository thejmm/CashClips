// src/pages/api/stripe/create-portal-session.ts

import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import createClient from "@/utils/supabase/api";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createClient(req, res);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const stripeCustomerId = user.user_metadata?.stripe_customer_id;
  if (!stripeCustomerId) {
    return res.status(400).json({ error: "Stripe customer ID not found" });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${req.headers.origin}/user/dashboard`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Portal Session Error:", err);
    return res.status(500).json({ error: "Unable to create portal session" });
  }
}
