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
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
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
    }
  }, [price_id, router]);

  const fetchClientSecret = useCallback(async () => {
    try {
      const { data } = await axios.post("/api/stripe/create-checkout-session", {
        price_id: price_id,
      });
      return data.clientSecret;
    } catch (error) {
      console.error("Error fetching client secret:", error);
      toast.error("An error occurred. Please try again.");
      throw error;
    }
  }, [price_id]);

  if (!price_id || !plan) return null;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-7xl py-16">
        <div className="max-w-6xl mx-auto md:grid md:grid-cols-2 gap-12">
          <div className="p-6 md:sticky md:top-0 md:self-start space-y-8">
            <div className="mt-16">
              <h2 className="text-3xl font-semibold mb-4">{plan.name} Plan</h2>
              <p className="text-xl mb-6">{plan.description}</p>
              <div className="text-4xl font-bold mb-6">
                $
                {(
                  (interval === "year" ? plan.yearlyPrice : plan.monthlyPrice) /
                  100
                ).toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{interval}
                </span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">
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

          <div className="mt-8 md:mt-0">
            <div className="bg-card rounded-3xl overflow-hidden shadow-xl">
              {stripePromise ? (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ fetchClientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              ) : (
                <Skeleton className="h-screen" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
