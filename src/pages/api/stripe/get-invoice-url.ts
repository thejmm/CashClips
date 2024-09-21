// src/pages/api/stripe/get-invoice-url.ts

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

  const { invoice_id } = req.query;

  if (!invoice_id || typeof invoice_id !== "string") {
    return res.status(400).json({ error: "Invalid invoice_id" });
  }

  const supabase = createClient(req, res);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const invoice = await stripe.invoices.retrieve(invoice_id);

    if (invoice.customer !== user.user_metadata?.stripe_customer_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const hostedInvoiceUrl = invoice.hosted_invoice_url;

    if (!hostedInvoiceUrl) {
      return res.status(404).json({ error: "Invoice URL not found" });
    }

    res.status(200).json({ url: hostedInvoiceUrl });
  } catch (error) {
    console.error("Error fetching invoice URL:", error);
    res.status(500).json({ error: "Failed to fetch invoice URL" });
  }
}
