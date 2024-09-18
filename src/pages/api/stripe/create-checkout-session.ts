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

  const { price_id, plan_name } = req.body;
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
          metadata: { supabase_user_id: user.id },
        });
        stripeCustomerId = customer.id;
        await supabase.auth.updateUser({
          data: { stripe_customer_id: stripeCustomerId },
        });
        await supabase
          .from("auth.users")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", user.id);
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

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      customer: stripeCustomerId,
      line_items: [{ price: price_id, quantity: 1 }],
      mode: "subscription",
      metadata: {
        supabase_user_id: user.id,
        plan_name: plan_name,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
      return_url: `${req.headers.origin}/user/return?session_id={CHECKOUT_SESSION_ID}`,
    });

    const totalCredits = parseInt(planDetails.features[0].split(" ")[1], 10);
    const { error: userDataError } = await supabase.from("user_data").upsert(
      {
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
        plan_name: plan_name,
        plan_price: planDetails.monthlyPrice,
        subscription_status: "pending",
        total_credits: totalCredits,
        used_credits: 0,
      },
      { onConflict: "user_id" },
    );

    if (userDataError) {
      console.error("Error updating user_data:", userDataError);
    }

    res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
}
