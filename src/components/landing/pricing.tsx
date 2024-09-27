// src/components/landing/pricing.tsx
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckIcon,
  Scissors,
  Video,
  XIcon,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/component";

export const pricingConfig = {
  plans: [
    {
      id: "prod_QvXTtv5odfOzcW",
      name: "Starter",
      description:
        "For new clippers starting their journey. Get essential tools to clip and make cash.",
      monthlyPrice: 1299, // $12.99
      yearlyPrice: 14029, // 10% off
      buttonText: "Go Starter",
      features: [
        "Generate 15 clips per month",
        "30fps export quality",
        "30s video length",
        "Auto-captioning",
      ],
      stripePriceId: {
        month: "price_1Q3gOxGXekY7Ey1HNqHTOjnF",
        year: "price_1Q3gPGGXekY7Ey1Hd8HjG2H4",
      },
    },
    {
      id: "prod_QvXVD1w1jPIsU5",
      name: "Clipper",
      description:
        "Perfect for clippers who need high-quality clips and more flexibility to cover daily posting limits.",
      monthlyPrice: 2999, // $29.99
      yearlyPrice: 32988, // 10% off
      isPopular: true,
      buttonText: "Go Clipper",
      features: [
        "Generate 30 clips per month",
        "30fps export quality",
        "60s video length",
        "Auto-captioning",
      ],
      stripePriceId: {
        month: "price_1Q3gQAGXekY7Ey1HatlfVPkv",
        year: "price_1Q3gTFGXekY7Ey1HgL9s8V7Y",
      },
    },
    {
      id: "prod_QvXVx0bApYi7Ab",
      name: "Streamer",
      description:
        "Ideal for streamers who need high-quality clips and more flexibility to cover 2x daily posting limits.",
      monthlyPrice: 6999, // $69.99
      yearlyPrice: 75589, // 10% off
      buttonText: "Go Streamer",
      features: [
        "Generate 60 clips per month",
        "30fps export quality",
        "60s video length",
        "Auto-captioning",
      ],
      stripePriceId: {
        month: "price_1Q3gQtGXekY7Ey1HGVjobmNz",
        year: "price_1Q3gTvGXekY7Ey1HJ5Lg61Jh",
      },
    },
    {
      id: "prod_QvXXnkvkKXyYC2",
      name: "Ultimate",
      description:
        "For professional clippers and popular streamers. Maximize your content output with high-quality clips.",
      monthlyPrice: 15999, // $159.99
      yearlyPrice: 172789, // 10% off
      buttonText: "Go Ultimate",
      isPro: true,
      features: [
        "Generate 100 clips per month",
        "60fps export quality",
        "60s video length",
        "Auto-captioning",
      ],
      stripePriceId: {
        month: "price_1Q3gSCGXekY7Ey1HqyElJiE1",
        year: "price_1Q3gUCGXekY7Ey1Hn6drSHf6",
      },
    },
    {
      id: "prod_QvXXN3MLJksYqg",
      name: "Agency",
      description:
        "Perfect for clip agencies and large creator teams. Get powerful tools to manage multiple channels efficiently.",
      monthlyPrice: 31998, // $319.98 (2x Ultimate)
      yearlyPrice: 345578, // 10% off of 2x Ultimate
      buttonText: "Go Agency",
      features: [
        "Generate 200 clips per month",
        "60fps export quality",
        "60s video length",
        "Auto-captioning",
      ],
      stripePriceId: {
        month: "price_1Q3gSQGXekY7Ey1HF5o4oWQ5",
        year: "price_1Q3gUSGXekY7Ey1HSLPmCEs6",
      },
    },
  ],
  defaultInterval: "month" as "month" | "year",
};

export const toHumanPrice = (price: number, decimals: number = 2) => {
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
  currentPlan: string | null;
  isLoggedIn: boolean;
  isHorizontal?: boolean;
}> = ({
  plan,
  interval,
  index,
  isInView,
  currentPlan,
  isLoggedIn,
  isHorizontal = false,
}) => {
  const currentPrice =
    interval === "year" ? plan.yearlyPrice : plan.monthlyPrice;
  const priceId = plan.stripePriceId[interval];
  const originalYearlyPrice = plan.monthlyPrice * 12;
  const yearlyDiscount = originalYearlyPrice - plan.yearlyPrice;

  const isCurrentPlan = currentPlan === plan.name;
  const isUpgrade =
    currentPlan &&
    pricingConfig.plans.indexOf(plan) >
      pricingConfig.plans.findIndex((p) => p.name === currentPlan);
  const isDowngrade =
    currentPlan &&
    pricingConfig.plans.indexOf(plan) <
      pricingConfig.plans.findIndex((p) => p.name === currentPlan);

  const handlePortalAction = async () => {
    const response = await fetch("/api/stripe/create-portal-session", {
      method: "POST",
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const renderButton = () => {
    if (!isLoggedIn) {
      return (
        <Link href="/login" passHref>
          <Button
            variant="ringHover"
            className="group w-full transition-all duration-300"
          >
            {plan.buttonText}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      );
    }

    if (isCurrentPlan) {
      return (
        <Button variant="outline" className="w-full" disabled>
          Current Plan
        </Button>
      );
    }

    if (currentPlan) {
      return (
        <Button
          variant="ringHover"
          className="group w-full transition-all duration-300"
          onClick={handlePortalAction}
        >
          {isUpgrade ? "Upgrade" : "Downgrade"}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      );
    }

    return (
      <Link href={`/checkout?price_id=${priceId}`} passHref>
        <Button
          variant="ringHover"
          className="group w-full transition-all duration-300"
        >
          {plan.buttonText}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    );
  };

  return (
    <motion.div
      className={`relative flex ${
        isHorizontal ? "flex-col lg:flex-row" : "flex-col justify-between"
      } ${
        plan.isPro || plan.isPopular
          ? "border-2 border-primary"
          : "border border-border"
      } h-full overflow-hidden rounded-xl`}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={index}
    >
      {plan.isPopular && (
        <p className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-2 py-1 text-xs font-semibold text-secondary">
          Trending
        </p>
      )}
      {plan.isPro && (
        <p className="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg bg-primary px-2 py-1 text-xs font-semibold text-secondary">
          Best Value
        </p>
      )}
      <div
        className={`flex flex-col ${isHorizontal ? "lg:w-2/3" : "w-full"} p-6`}
      >
        <div className="relative mb-4">
          <h3 className="text-2xl font-bold">{plan.name}</h3>
          <p className="mt-1 text-muted-foreground">{plan.description}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${plan.id}-${interval}-${currentPrice}`}
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {interval === "year" ? (
              <>
                <div className="mb-1 text-muted-foreground">
                  <span className="text-2xl line-through">
                    ${toHumanPrice(originalYearlyPrice, 2)}
                  </span>
                  <span className="text-sm font-normal">/year</span>
                </div>
                <div className="text-4xl font-bold">
                  ${toHumanPrice(currentPrice, 2)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /year
                  </span>
                </div>
                <motion.p
                  className="mt-1 text-sm font-semibold text-green-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  Save ${toHumanPrice(yearlyDiscount, 2)} per year!
                </motion.p>
              </>
            ) : (
              <div className="text-4xl font-bold">
                ${toHumanPrice(currentPrice, 2)}
                <span className="text-sm font-normal text-muted-foreground">
                  /month
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        className={`flex flex-col justify-between ${
          isHorizontal ? "lg:w-1/2" : "w-full"
        } bg-muted/50 p-6`}
      >
        {plan.features && plan.features.length > 0 && (
          <div className="mb-6">
            <p className="mb-2 font-semibold">Features:</p>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center">
                  <CheckIcon className="mr-2 h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-auto">{renderButton()}</div>
      </div>
    </motion.div>
  );
};

export function CashClipsPricing({
  showFeaturesTable = false,
  showBenefitsSection = false,
}: {
  showFeaturesTable?: boolean;
  showBenefitsSection?: boolean;
}) {
  const [interval, setInterval] = useState<"month" | "year">(
    pricingConfig.defaultInterval,
  );
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [user, setUser] = useState<any | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("user_data")
          .select("plan_name")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching user plan:", error);
        } else if (data) {
          setCurrentPlan(data.plan_name);
        }
      }
    };

    fetchUserData();
  }, []);

  const amountFeatures = ["Clip Amounts", "Clip Qualities", "Clip Lengths"];

  const booleanFeatures = [
    "Choose Any Streamers",
    "Choose Any Template",
    "Auto-Generate Captions",
    "Export to Any Platform",
  ];

  function getPlanFeatureMap(planFeatures: string[]): {
    [key: string]: string;
  } {
    const featureMap: { [key: string]: string } = {};

    for (const feature of planFeatures) {
      if (feature.startsWith("Generate")) {
        featureMap["Clip Amounts"] = feature.replace("Generate ", "");
      } else if (feature.includes("export quality")) {
        featureMap["Clip Qualities"] = feature.replace(" export quality", "");
      } else if (feature.includes("video length")) {
        featureMap["Clip Lengths"] = feature.replace(" video length", "");
      } else if (feature.endsWith("Auto-captioning")) {
        featureMap["Caption Qualities"] = feature;
      }
    }

    return featureMap;
  }

  return (
    <section id="pricing" ref={sectionRef} className="container mx-auto py-20">
      <div>
        <div className="w-full">
          <div className="container mx-auto max-w-3xl">
            <div className="flex justify-start">
              <motion.div
                className="-rotate-8 inline-block transform rounded-full bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
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
        {/* Bento Pricing Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-1 lg:grid-cols-3">
          {pricingConfig.plans.slice(0, 3).map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              index={index}
              isInView={isInView}
              currentPlan={currentPlan}
              isLoggedIn={!!user}
            />
          ))}
        </div>
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {pricingConfig.plans.slice(3, 5).map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              interval={interval}
              index={index + 3}
              isInView={isInView}
              currentPlan={currentPlan}
              isLoggedIn={!!user}
              isHorizontal={true}
            />
          ))}
        </div>

        {/* Features Table */}
        {showFeaturesTable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left font-medium"></th>
                    {pricingConfig.plans.map((plan) => (
                      <th
                        key={plan.name}
                        className="border-b p-4 text-center font-medium"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Amount Features */}
                  {amountFeatures.map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="px-4 py-4 text-left font-medium">
                        {feature}
                      </td>
                      {pricingConfig.plans.map((plan) => {
                        const featureMap = getPlanFeatureMap(plan.features);
                        return (
                          <td key={plan.id} className="px-4 py-4 text-center">
                            {featureMap[feature] || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Boolean Features */}
                  {booleanFeatures.map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="px-4 py-4 text-left font-medium">
                        {feature}
                      </td>
                      {pricingConfig.plans.map((plan) => (
                        <td key={plan.id} className="px-4 py-4 text-center">
                          <CheckIcon className="mx-auto h-5 w-5 text-green-500" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Enterprise Option */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8"
        >
          <Card className="overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <CardContent className="p-6 md:p-8 lg:w-1/3">
                <CardTitle className="mb-2 text-2xl">Enterprise</CardTitle>
                <CardDescription className="mb-6">
                  Tailored solutions for large organizations and custom
                  requirements.
                </CardDescription>
                <Link href="/contact" passHref>
                  <Button
                    variant="ringHover"
                    className="group w-full transition-all duration-300"
                  >
                    Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>

              <motion.div
                className="relative isolate flex items-center justify-center bg-primary p-6 md:p-8 lg:w-2/3"
                initial={{ x: 100, opacity: 0 }}
                animate={
                  isInView ? { x: 0, opacity: 1 } : { x: 100, opacity: 0 }
                }
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="text-center text-primary-foreground">
                  <motion.h1
                    className="mb-2 text-4xl font-bold"
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
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Benefits Section */}
      {showBenefitsSection && (
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.4 }}
        >
          <h3 className="mb-4 text-2xl font-bold">
            Get the most value with CashClips!
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <Scissors className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">Effortless Clipping</h3>
              <p>Create engaging clips with just a few clicks</p>
            </div>
            <div>
              <Video className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">High-Quality Exports</h3>
              <p>Export your clips in stunning quality</p>
            </div>
            <div>
              <Zap className="mx-auto mb-4 h-12 w-12 text-primary" />
              <h3 className="mb-2 font-semibold">Boost Your Content</h3>
              <p>Increase engagement and grow your audience</p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
