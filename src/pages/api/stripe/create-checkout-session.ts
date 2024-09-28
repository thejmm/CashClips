// src/pages/api/stripe/create-checkout-session.ts
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import createClient from "@/utils/supabase/api";
import { pricingConfig } from "@/components/landing/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }
  const { price_id, plan_name, promotekit_referral } = req.body;
  if (!price_id || !plan_name) {
    return res.status(400).json({ error: "Missing price_id or plan_name" });
  }
  const supabase = createClient(req, res);
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return res.status(401).json({ error: "Unauthorized" });
    }
    let stripeCustomerId = user.user_metadata?.stripe_customer_id;
    if (stripeCustomerId) {
      try {
        await stripe.customers.retrieve(stripeCustomerId);
      } catch (error) {
        console.error("Error retrieving Stripe customer:", error);
        stripeCustomerId = null;
      }
    }
    if (!stripeCustomerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: {
            supabase_user_id: user.id,
            promotekit_referral: promotekit_referral || "",
          },
        });
        stripeCustomerId = customer.id;
        await supabase.auth.updateUser({
          data: { stripe_customer_id: stripeCustomerId },
        });
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        return res
          .status(500)
          .json({ error: "Failed to create Stripe customer" });
      }
    }
    const planDetails = pricingConfig.plans.find((p) => p.name === plan_name);
    if (!planDetails) {
      return res.status(400).json({ error: "Invalid plan name" });
    }

    const totalCreditsMatch = planDetails.features[0].match(
      /Generate (\d+) clips per month/,
    );
    const totalCredits = totalCreditsMatch
      ? parseInt(totalCreditsMatch[1], 10)
      : 0;

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer: stripeCustomerId,
      line_items: [{ price: price_id, quantity: 1 }],
      mode: "subscription",
      metadata: {
        supabase_user_id: user.id,
        plan_name: plan_name,
        promotekit_referral: promotekit_referral || "",
        total_credits: totalCredits.toString(),
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          promotekit_referral: promotekit_referral || "",
        },
      },
      return_url: `${req.headers.origin}/auth/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
