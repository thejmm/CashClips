import { ArrowRight, CheckIcon, Scissors, Video, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";

export const pricingConfig = {
  plans: [
    {
      id: "prod_Starter",
      name: "Starter",
      description:
        "For new clippers looking to start their journey in content creation. Get the essential tools to clip and share your favorite moments.",
      monthlyPrice: 999, // $9.99
      yearlyPrice: 10789, // 10% off
      buttonText: "Go Starter",
      features: [
        "Generate 12 clips per month",
        "720p/30fps export quality",
        "Basic auto-captioning",
      ],
      stripePriceId: {
        month: "price_1XXXXXXXXXXXXXXXX1",
        year: "price_1XXXXXXXXXXXXXXXX2",
      },
    },
    {
      id: "prod_Pro",
      name: "Pro",
      description:
        "Ideal for dedicated clippers and growing channels. Enhance your content with more clips and advanced features to stand out from the crowd.",
      monthlyPrice: 2999, // $29.99
      yearlyPrice: 32389, // 10% off
      buttonText: "Go Pro",
      features: [
        "Generate 50 clips per month",
        "1080p/60fps export quality",
        "Advanced auto-captioning",
      ],
      stripePriceId: {
        month: "price_1XXXXXXXXXXXXXXXX3",
        year: "price_1XXXXXXXXXXXXXXXX4",
      },
    },
    {
      id: "prod_Ultimate",
      name: "Ultimate",
      description:
        "For professional clippers and popular streamers. Maximize your content output with high-quality clips to grow your audience.",
      monthlyPrice: 4999, // $49.99
      yearlyPrice: 53989, // 10% off
      buttonText: "Go Ultimate",
      isPro: true,
      features: [
        "Generate 100 clips per month",
        "1080p/60fps export quality",
        "Premium auto-captioning",
      ],
      stripePriceId: {
        month: "price_1XXXXXXXXXXXXXXXX5",
        year: "price_1XXXXXXXXXXXXXXXX6",
      },
    },
    {
      id: "prod_Agency",
      name: "Agency",
      description:
        "Perfect for clip agencies and large creator teams. Get unlimited clipping power and collaborative tools to manage multiple channels efficiently.",
      monthlyPrice: 9999, // $99.99
      yearlyPrice: 107989, // 10% off
      buttonText: "Go Agency",
      features: [
        "Generate 200 clips per month",
        "1080p/60fps export quality",
        "Premium auto-captioning",
      ],
      stripePriceId: {
        month: "price_1XXXXXXXXXXXXXXXX7",
        year: "price_1XXXXXXXXXXXXXXXX8",
      },
    },
  ],
  defaultInterval: "month" as "month" | "year",
};

const toHumanPrice = (price: number, decimals: number = 2) => {
  return Number(price / 100).toFixed(decimals);
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

const PlanCard: React.FC<{
  plan: (typeof pricingConfig.plans)[0];
  interval: "month" | "year";
  index: number;
  isInView: boolean;
}> = ({ plan, interval, index, isInView }) => {
  const priceId = plan.stripePriceId[interval];
  const price = interval === "year" ? plan.yearlyPrice : plan.monthlyPrice;
  const originalYearlyPrice = plan.monthlyPrice * 12;
  const yearlyDiscount = originalYearlyPrice - plan.yearlyPrice;

  return (
    <motion.div
      className={`flex flex-col ${
        plan.isPro ? "border-2 border-primary rounded-xl" : ""
      }`}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
    >
      <Card className="h-full">
        <CardHeader className="relative">
          {plan.isPro && (
            <p className="absolute top-0 right-0 bg-primary rounded-bl-lg rounded-tr-lg px-2 py-1 text-secondary font-semibold">
              Most Popular
            </p>
          )}
          <CardTitle className="text-xl">{plan.name}</CardTitle>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <motion.div
            key={`${plan.id}-${interval}`}
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {interval === "year" ? (
              <>
                <div className="text-muted-foreground mb-1">
                  <span className="text-2xl line-through">
                    {" "}
                    ${toHumanPrice(originalYearlyPrice, 2)}
                  </span>
                  <span className="text-sm font-normal">/year</span>
                </div>
                <div className="text-4xl font-bold">
                  ${toHumanPrice(price, 2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /year
                  </span>
                </div>
                <motion.p
                  className="text-sm text-green-500 font-semibold mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                  }
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  Save ${toHumanPrice(yearlyDiscount, 2)} per year!
                </motion.p>
              </>
            ) : (
              <div className="text-4xl font-bold">
                ${toHumanPrice(price, 2)}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
            )}
          </motion.div>
          {plan.features && plan.features.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Features:</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckIcon className="mr-2 h-5 w-5 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
        <div className="p-6 pt-0 mt-auto">
          <Link href={`/checkout?price_id=${priceId}`} passHref>
            <Button
              variant="ringHover"
              className="w-full group transition-all duration-300"
            >
              {plan.buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export function CashClipsPricing() {
  const [interval, setInterval] = useState<"month" | "year">(
    pricingConfig.defaultInterval,
  );
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section id="pricing" ref={sectionRef} className="container mx-auto py-20">
      <div>
        <div className="w-full">
          <div className="container mx-auto max-w-3xl">
            <div className="flex justify-start">
              <motion.div
                className="inline-block bg-primary text-primary-foreground text-xs font-bold py-2 px-3 rounded-full transform -rotate-8"
                initial={{ opacity: 0, y: 20, rotate: -12 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, rotate: -8 }
                    : { opacity: 0, y: 20, rotate: -12 }
                }
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                ✨Save 10% Yearly
              </motion.div>
            </div>
          </div>
        </div>
        <motion.h2
          className="mb-8 text-center text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Choose Your CashClips Plan
        </motion.h2>
        <motion.div
          className="mb-8 flex justify-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={interval === "month" ? "font-bold" : ""}>
            Monthly
          </span>
          <Switch
            checked={interval === "year"}
            onCheckedChange={(checked) =>
              setInterval(checked ? "year" : "month")
            }
          />
          <span className={interval === "year" ? "font-bold" : ""}>Yearly</span>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingConfig.plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className="my-12 flex items-center justify-between overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <CardTitle className="mb-2 text-2xl">Enterprise</CardTitle>
              <CardDescription className="mb-6">
                Tailored solutions for large organizations and custom
                requirements.
              </CardDescription>
              <Link href="/contact" passHref>
                <Button
                  variant="ringHover"
                  className="w-full group transition-all duration-300"
                >
                  Contact Us
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </CardContent>
            <motion.div
              className="before:content-[''] relative isolate hidden h-[240px] w-full before:absolute before:left-32 before:top-0 before:z-[-1] before:h-full before:w-full before:skew-x-[-45deg] before:border-l before:border-muted before:bg-primary md:block lg:w-2/3"
              initial={{ x: 100, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="ml-12 flex h-full w-full flex-col items-center justify-center gap-y-0.5">
                <motion.h1
                  className="text-4xl font-bold"
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{ duration: 0.4, delay: 1.5 }}
                >
                  Need more?
                </motion.h1>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={
                    isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }
                  }
                  transition={{ duration: 0.4, delay: 1.7 }}
                >
                  Contact us for more information about a custom plan.
                </motion.p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ delay: 1.4 }}
      >
        <h3 className="text-2xl font-bold mb-4">
          Get the most value with CashClips!
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Scissors className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Effortless Clipping</h3>
            <p>Create engaging clips with just a few clicks</p>
          </div>
          <div>
            <Video className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">High-Quality Exports</h3>
            <p>Export your clips in stunning quality</p>
          </div>
          <div>
            <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold mb-2">Boost Your Content</h3>
            <p>Increase engagement and grow your audience</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
