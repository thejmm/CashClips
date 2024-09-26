// src/pages/api/stripe/checkout-sessions.ts
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";
import createClient from "@/utils/supabase/api";
import { v4 as uuidv4 } from "uuid";

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
        id: uuidv4(),
        user_id: userData.user_id,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: session.customer.id,
        status: subscription.status,
        plan_id: subscription.items.data[0]?.price.id,
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ).toISOString(),
        current_period_end: new Date(
          subscription.current_period_end * 1000
        ).toISOString(),
        created_at: new Date(subscription.created * 1000).toISOString(),
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        cancel_at: subscription.cancel_at
          ? new Date(subscription.cancel_at * 1000).toISOString()
          : null,
        ended_at: subscription.ended_at
          ? new Date(subscription.ended_at * 1000).toISOString()
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
      stripe_subscription_id: subscriptionData?.stripe_subscription_id || null,
      plan_name: session.metadata?.plan_name || userData.plan_name,
      plan_price: session.amount_total || userData.plan_price,
      subscription_status:
        subscriptionData?.status || userData.subscription_status,
      next_billing_date:
        subscriptionData?.current_period_end || userData.next_billing_date,
      current_period_start:
        subscriptionData?.current_period_start || userData.current_period_start,
      current_period_end:
        subscriptionData?.current_period_end || userData.current_period_end,
      canceled_at: subscriptionData?.canceled_at || userData.canceled_at,
      trial_start: subscriptionData?.trial_start || userData.trial_start,
      trial_end: subscriptionData?.trial_end || userData.trial_end,
      total_credits: session.metadata?.total_credits
        ? parseInt(session.metadata.total_credits)
        : userData.total_credits,
      used_credits: 0,
      updated_at: new Date().toISOString(),
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

    // Handle invoice creation if needed
    if (session.invoice && typeof session.invoice !== "string") {
      const invoice = session.invoice;
      const invoiceData = {
        id: uuidv4(),
        stripe_invoice_id: invoice.id,
        user_id: userData.user_id,
        status: invoice.status,
        currency: invoice.currency,
        amount_due: invoice.amount_due,
        amount_paid: invoice.amount_paid,
        amount_remaining: invoice.amount_remaining,
        created: new Date(invoice.created * 1000).toISOString(),
        period_start: new Date(invoice.period_start * 1000).toISOString(),
        period_end: new Date(invoice.period_end * 1000).toISOString(),
        stripe_subscription_id:
          subscriptionData?.stripe_subscription_id || null,
      };

      const { error: invoiceError } = await supabase
        .from("invoices")
        .upsert(invoiceData, { onConflict: "stripe_invoice_id" });

      if (invoiceError) {
        console.error("Error creating invoice:", invoiceError);
      } else {
        console.log("Invoice created successfully");
      }
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
