// src/pages/checkout.tsx

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import React, { useCallback, useEffect, useState } from "react";

import { CheckCircle } from "lucide-react";
import { NextSeo } from "next-seo";
import Script from "next/script";
import { Skeleton } from "@/components/ui/skeleton";
import { loadStripe } from "@stripe/stripe-js";
import { pricingConfig } from "@/components/landing/pricing";
import { toast } from "sonner";
import { useRouter } from "next/router";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const billingQuestions = [
  {
    question: "What is your refund policy?",
    answer:
      "All sales are final. We do not offer refunds for any purchases. By completing this transaction, you agree to this no-refund policy.",
  },
  {
    question: "How will I be billed?",
    answer:
      "You will be billed immediately upon completing this transaction. For subscription plans, subsequent charges will occur on the same date each billing cycle.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, you can cancel your subscription at any time. However, you will continue to have access to the service until the end of your current billing period. No refunds will be issued for partial months.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards including Visa, MasterCard, American Express, and Discover. We also support various digital payment methods depending on your location.",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Yes, we use industry-standard encryption and security measures to protect your payment information. We partner with Stripe, a PCI-DSS compliant payment processor, to handle all transactions securely.",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { price_id } = router.query;
  const [plan, setPlan] = useState<any | null>(null);
  const [interval, setInterval] = useState<"month" | "year">("month");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!price_id) {
      router.push("/pricing");
      return;
    }

    const fetchedPlan = pricingConfig.plans.find((p) =>
      Object.values(p.stripePriceId).includes(price_id as string),
    );

    if (!fetchedPlan) {
      router.push("/pricing");
    } else {
      setPlan(fetchedPlan);
      setInterval(
        price_id === fetchedPlan.stripePriceId.year ? "year" : "month",
      );
      setLoading(false);
    }
  }, [price_id, router]);

  const fetchClientSecret = useCallback(async () => {
    if (!plan) return;

    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_id: price_id,
          plan_name: plan.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error("Error fetching client secret:", error);
      toast.error(
        "An error occurred while preparing the checkout. Please try again.",
      );
    }
  }, [price_id, plan]);

  useEffect(() => {
    if (price_id && plan) {
      fetchClientSecret();
    }
  }, [fetchClientSecret, price_id, plan]);

  if (!price_id || !plan) return null;

  return (
    <>
      <NextSeo
        title={`${plan.name} Plan - CashClips`}
        description={`Secure your ${plan.name} plan today and start creating amazing content with CashClips.`}
        canonical={`https://cashclips.io/checkout?price_id=${price_id}`}
        openGraph={{
          url: `https://cashclips.io/checkout?price_id=${price_id}`,
          title: `${plan.name} Plan Checkout - CashClips`,
          description: `Secure your ${plan.name} plan today and start creating amazing content with CashClips.`,
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: `${plan.name} Plan Checkout`,
            },
          ],
        }}
        twitter={{
          handle: "@cashclipsio",
          site: "@cashclipsio",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "robots",
            content: "index, follow",
          },
          {
            name: "og:site_name",
            content: "CashClips",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "canonical",
            href: `https://cashclips.io/checkout?price_id=${price_id}`,
          },
        ]}
      />
      <Script
        src="https://cdn.promotekit.com/promotekit.js"
        data-promotekit="a1ede120-2bf6-4afa-9c88-f9bf10ebbd46"
        strategy="afterInteractive"
      />
      <div className="min-h-screen">
        <div className="container mx-auto max-w-7xl py-8 md:py-16">
          <div className="mx-auto max-w-6xl md:grid md:grid-cols-2 md:gap-12">
            {/* Stripe Embed Section */}
            <div className="mb-8 md:order-2 md:mb-0">
              <div className="overflow-hidden rounded-3xl bg-card shadow-xl">
                {clientSecret ? (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout className="min-h-[600px] md:min-h-screen" />
                  </EmbeddedCheckoutProvider>
                ) : (
                  <Skeleton className="min-h-[600px] animate-pulse md:min-h-screen" />
                )}
              </div>
            </div>

            {/* Plan Details and FAQs Section */}
            <div className="space-y-8 p-4 md:sticky md:top-20 md:order-1 md:self-start md:p-6">
              <div>
                <h2 className="mb-4 text-2xl font-semibold md:text-3xl">
                  {plan.name} Plan
                </h2>
                <p className="mb-6 text-lg md:text-xl">{plan.description}</p>
                <div className="mb-6 text-3xl font-bold md:text-4xl">
                  $
                  {(
                    (interval === "year"
                      ? plan.yearlyPrice
                      : plan.monthlyPrice) / 100
                  ).toFixed(2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{interval}
                  </span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 text-xl font-semibold md:text-2xl">
                  Billing Information
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {billingQuestions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
