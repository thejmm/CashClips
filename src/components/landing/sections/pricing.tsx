// src/components/landing/sections/pricing.tsx
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

import { AuthModal } from "../auth/auth-modal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/utils/supabase/component";

export const pricingConfig = {
  plans: [
    {
      id: "prod_Basic",
      name: "Basic",
      description:
        "For new designers starting their journey. Get essential tools to create and share your favorite designs.",
      monthlyPrice: 1299,
      yearlyPrice: 14029,
      buttonText: "Go Basic",
      features: [
        "Basic Components & Sections",
        "1 Page Limit",
        "2 Project Limit",
        "1 API Key",
      ],
      stripePriceId: {
        month: "price_1Q1CPuBDqeaQNs6YdCLY1mD0",
        year: "price_1Q1CPuBDqeaQNs6YtYxcLJyp",
      },
    },
    {
      id: "prod_Pro",
      name: "Pro",
      description:
        "Ideal for dedicated designers and growing businesses. Enhance your content with more templates.",
      monthlyPrice: 4999,
      yearlyPrice: 53989,
      buttonText: "Go Pro",
      features: [
        "Pro Components & Sections",
        "5 Page Limit",
        "5 Project Limit",
        "1 API Key",
      ],
      stripePriceId: {
        month: "price_1Q1CQCBDqeaQNs6YdPBwgOEL",
        year: "price_1Q1CQQBDqeaQNs6Yx5khMVnt",
      },
    },
    {
      id: "prod_Ultimate",
      name: "Ultimate",
      description:
        "For professional designers and popular businesses. Maximize your design output with premium features.",
      monthlyPrice: 9999,
      yearlyPrice: 107989,
      buttonText: "Go Ultimate",
      isPro: true,
      features: [
        "All Components & Sections",
        "10 Page Limit",
        "10 Project Limit",
        "2 API Keys",
      ],
      stripePriceId: {
        month: "price_1Q1CQnBDqeaQNs6YmI9ZqKD9",
        year: "price_1Q1CR6BDqeaQNs6YyvouiFBg",
      },
    },
    {
      id: "prod_Agency",
      name: "Agency",
      description:
        "Perfect for design agencies and large teams. Get powerful tools to manage multiple projects efficiently.",
      monthlyPrice: 19999,
      yearlyPrice: 215989,
      buttonText: "Go Agency",
      features: [
        "All Components & Sections",
        "20 Page Limit",
        "Unlimited Project Limit",
        "5 API Keys",
      ],
      stripePriceId: {
        month: "price_1Q1CRaBDqeaQNs6YfTmmMlnn",
        year: "price_1Q1CRmBDqeaQNs6YWxtBRe8i",
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
  onPurchase: (priceId: string) => void;
}> = ({
  plan,
  interval,
  index,
  isInView,
  currentPlan,
  isLoggedIn,
  onPurchase,
}) => {
  const currentPrice =
    interval === "year" ? plan.yearlyPrice : plan.monthlyPrice;
  const priceId = plan.stripePriceId[interval];
  const originalYearlyPrice = plan.monthlyPrice * 12;
  const yearlyDiscount = originalYearlyPrice - plan.yearlyPrice;

  const isCurrentPlan = currentPlan === plan.name;

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
                  <div className="text-muted-foreground mb-1">
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
                    className="text-sm text-green-500 font-semibold mt-1"
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
          {isCurrentPlan ? (
            <Button variant="outline" className="w-full" disabled>
              Current Plan
            </Button>
          ) : (
            <Button
              variant="ringHover"
              className="w-full group transition-all duration-300"
              onClick={() => onPurchase(priceId)}
            >
              {plan.buttonText}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export function Pricing({
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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
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
          .eq("subscription_status", "active")
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

  const handlePurchase = (priceId: string) => {
    if (user) {
      window.location.href = `/checkout?price_id=${priceId}`;
    } else {
      setSelectedPriceId(priceId);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    if (selectedPriceId) {
      window.location.href = `/checkout?price_id=${selectedPriceId}`;
    }
  };

  const amountFeatures = [
    "Component Access",
    "Project Limit",
    "Page Limit",
    "API Key Limit",
  ];

  const booleanFeatures = [
    "Unlimited Exports",
    "SEO Optimized",
    "Easy Customization",
    "Perpetual license",
    "Commercial use",
  ];

  function getPlanFeatureMap(planFeatures: string[]): {
    [key: string]: string;
  } {
    const featureMap: { [key: string]: string } = {};

    for (const feature of planFeatures) {
      if (feature.toLowerCase().includes("components & sections")) {
        featureMap["Component Access"] = feature;
      } else if (feature.toLowerCase().includes("page limit")) {
        featureMap["Page Limit"] = feature;
      } else if (feature.toLowerCase().includes("project limit")) {
        featureMap["Project Limit"] = feature;
      } else if (feature.toLowerCase().includes("api key")) {
        featureMap["API Key Limit"] = feature;
      }
    }

    return featureMap;
  }

  return (
    <section id="pricing" ref={sectionRef} className="container mx-auto">
      <div>
        <div className="w-full">
          <div className="mx-auto max-w-5xl">
            <div className="flex justify-start">
              <motion.div
                className="inline-block bg-primary text-primary-foreground text-xs font-bold py-2 px-3 rounded-full transform -rotate-8"
                initial={{ opacity: 0, y: 20, rotate: -12 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0, rotate: -8 }
                    : { opacity: 0, y: 20, rotate: -12 }
                }
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
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
          Choose Your Plan
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
              currentPlan={currentPlan}
              isLoggedIn={!!user}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {showFeaturesTable && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="overflow-x-auto mt-12">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left font-medium"></th>
                    {pricingConfig.plans.map((plan) => (
                      <th
                        key={plan.name}
                        className="p-4 text-center font-medium border-b"
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amountFeatures.map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="py-4 px-4 text-left font-medium">
                        {feature}
                      </td>
                      {pricingConfig.plans.map((plan) => {
                        const featureMap = getPlanFeatureMap(plan.features);
                        return (
                          <td key={plan.id} className="py-4 px-4 text-center">
                            {featureMap[feature] || "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {booleanFeatures.map((feature) => (
                    <tr key={feature} className="border-b">
                      <td className="py-4 px-4 text-left font-medium">
                        {feature}
                      </td>
                      {pricingConfig.plans.map((plan) => (
                        <td key={plan.id} className="py-4 px-4 text-center">
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
                  className="text-primary-foreground text-4xl font-bold"
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
                  className="text-primary-foreground"
                >
                  Contact us for more information about a custom plan.
                </motion.p>
              </div>
            </motion.div>
          </Card>
        </motion.div>
      </div>

      {showBenefitsSection && (
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 1.4 }}
        >
          <h3 className="text-2xl font-bold mb-4">
            Get the most value with our plans!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Scissors className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Effortless Design</h3>
              <p>Create engaging designs with just a few clicks</p>
            </div>
            <div>
              <Video className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">High-Quality Exports</h3>
              <p>Export your designs in stunning quality</p>
            </div>
            <div>
              <Zap className="mx-auto h-12 w-12 text-primary mb-4" />
              <h3 className="font-semibold mb-2">Boost Your Brand</h3>
              <p>Increase engagement and grow your audience</p>
            </div>
          </div>
        </motion.div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        showReturnButton={false}
      />
    </section>
  );
}
