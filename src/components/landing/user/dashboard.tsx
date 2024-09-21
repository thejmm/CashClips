// src/components/landing/user/dashboard.tsx
"use-client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  CodeIcon,
  CreditCardIcon,
  Loader,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pricing, pricingConfig, toHumanPrice } from "../sections/pricing";
import React, { useCallback, useEffect, useState } from "react";

import APIKeyManager from "./dash/api-key-manager";
import { Button } from "@/components/ui/button";
import InvoiceTable from "./dash/invoice-table";
import Link from "next/link";
import PasswordSection from "./dash/password-change";
import PlanInfo from "./dash/plan-info";
import { Separator } from "@/components/ui/separator";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { Switch } from "@/components/ui/switch";
import UsernameInfo from "./dash/username-info";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

interface UserData {
  plan_name: string;
  plan_price: number;
  used_credits: number;
  total_credits: number;
  subscription_status: string;
  next_billing_date: string;
}

interface InvoiceData {
  id: string;
  stripe_invoice_id: string;
  user_id: string;
  subscription_id: string;
  status: string;
  currency: string;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  created: string;
  period_start: string;
  period_end: string;
}

interface SubscriptionData {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  created_at: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string;
  trial_start: string;
  trial_end: string;
}

const UserDashboard: React.FC<{ user: SupabaseAuthUser }> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[] | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<
    SubscriptionData[] | null
  >(null);
  const [isActiveSubscription, setIsActiveSubscription] = useState<
    boolean | null
  >(null);
  const router = useRouter();
  const { tab } = router.query;

  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: invoiceData } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id);

      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id);

      setInvoiceData(invoiceData as InvoiceData[]);
      setSubscriptionData(subscriptionData as SubscriptionData[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [user.id, supabase]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const fetchSubscriptionStatus = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setIsActiveSubscription(data?.status === "active");
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      setIsActiveSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [user.id]);

  const [selectedInterval, setSelectedInterval] = useState<"month" | "year">(
    "year",
  );

  const handleCheckout = (priceId: string) => {
    window.location.href = `/checkout?price_id=${priceId}`;
  };

  const renderContent = () => {
    switch (tab) {
      case "billing":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Billing</h2>
            <Separator className="mb-4" />
            <div className="flex flex-col gap-4">
              <PlanInfo userData={userData} user={user} />
              <InvoiceTable invoiceData={invoiceData} />
            </div>
          </div>
        );
      case "security":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Security</h2>
            <Separator className="mb-4" />
            <PasswordSection user={user} />
          </div>
        );
      case "api":
        // Show the "no active plan" message only for the API tab
        if (!isActiveSubscription) {
          return (
            <div className="flex flex-col text-center items-center justify-center">
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  You do not have an active plan. Please upgrade to a plan to
                  use this feature.
                </p>
              </div>
              <div className="w-full">
                <div className="container mx-auto w-full">
                  <div className="flex justify-center pr-56">
                    <motion.div
                      className="inline-block bg-primary text-primary-foreground text-xs font-bold py-2 px-3 rounded-full transform -rotate-8"
                      initial={{ opacity: 0, y: 20, rotate: -12 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        rotate: -8,
                        transition: {
                          type: "spring",
                          stiffness: 260,
                          damping: 20,
                        },
                      }}
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
              <div className="flex justify-center items-center space-x-4 mb-6">
                <span
                  className={selectedInterval === "month" ? "font-bold" : ""}
                >
                  Monthly
                </span>
                <Switch
                  checked={selectedInterval === "year"}
                  onCheckedChange={(checked) =>
                    setSelectedInterval(checked ? "year" : "month")
                  }
                />
                <span
                  className={selectedInterval === "year" ? "font-bold" : ""}
                >
                  Yearly
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                {pricingConfig.plans.map((plan) => {
                  const price =
                    selectedInterval === "year"
                      ? plan.yearlyPrice
                      : plan.monthlyPrice;
                  const priceId = plan.stripePriceId[selectedInterval];
                  const originalYearlyPrice = plan.monthlyPrice * 12;
                  const yearlyDiscount = originalYearlyPrice - plan.yearlyPrice;

                  return (
                    <motion.div
                      key={plan.id}
                      className={`p-4 rounded-lg relative ${
                        plan.isPro
                          ? "border-2 border-primary shadow-lg"
                          : "border border-muted"
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {plan.isPro && (
                        <div className="absolute -top-[2px] -right-[2px]">
                          <p className="bg-primary text-primary-foreground text-xs font-bold py-1 px-3 rounded-bl-lg rounded-tr-lg inline-block">
                            Most Popular
                          </p>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {plan.description}
                        </p>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`${plan.id}-${selectedInterval}-${price}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="mb-4"
                          >
                            {selectedInterval === "year" && (
                              <div className="text-muted-foreground mb-1">
                                <span className="text-lg line-through">
                                  ${toHumanPrice(originalYearlyPrice, 2)}
                                </span>
                                <span className="text-sm font-normal">
                                  /year
                                </span>
                              </div>
                            )}
                            <div className="text-3xl font-bold">
                              ${toHumanPrice(price, 2)}
                              <span className="text-sm font-normal text-muted-foreground">
                                /{selectedInterval}
                              </span>
                            </div>
                            {selectedInterval === "year" && (
                              <p className="text-sm text-green-500 font-semibold mt-1">
                                Save ${toHumanPrice(yearlyDiscount, 2)} per
                                year!
                              </p>
                            )}
                          </motion.div>
                        </AnimatePresence>
                        <ul className="space-y-2 mb-4">
                          {plan.features.map((feature, index) => (
                            <li
                              key={index}
                              className="flex items-center text-sm"
                            >
                              <Check className="mr-2 h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="ringHover"
                          className="w-full group transition-all duration-300"
                          onClick={() => handleCheckout(priceId)}
                        >
                          {plan.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <Link href="/pricing" passHref className="mx-auto justify-center">
                <Button
                  variant="ringHover"
                  className="mt-4 w-full group transition-all duration-300"
                >
                  View All Features
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          );
        }
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">API</h2>
            <Separator className="mb-4" />
            <APIKeyManager user={user} />
          </div>
        );
      case "profile":
      case undefined:
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <Separator className="mb-4" />
            <UsernameInfo />
          </div>
        );
      default:
        return <p>Invalid tab selection.</p>;
    }
  };

  return (
    <>
      {/* Sidebar Navigation */}
      <aside className="sticky top-0 w-full p-2 md:w-64 md:p-6">
        <div className="mb-8 flex justify-start ml-8 md:ml-0 md:justify-start">
          <Avatar>
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>{user?.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-col ml-4 flex">
            <h3 className="text-xl font-bold ">
              {user.user_metadata?.username || user.email}
            </h3>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        {/* Mobile Tabs */}
        <nav className="md:hidden flex justify-center mb-6">
          <div className="gap-1 p-1 space-x-1 border rounded-xl">
            <Link href="/user" passHref>
              <Button
                variant={tab === "profile" || !tab ? "default" : "outline"}
              >
                Profile
              </Button>
            </Link>
            <Link href="/user?tab=billing" passHref>
              <Button variant={tab === "billing" ? "default" : "outline"}>
                Billing
              </Button>
            </Link>
            <Link href="/user?tab=security" passHref>
              <Button variant={tab === "security" ? "default" : "outline"}>
                Security
              </Button>
            </Link>
            <Link href="/user?tab=api" passHref>
              <Button variant={tab === "api" ? "default" : "outline"}>
                API
              </Button>
            </Link>
          </div>
        </nav>

        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col space-y-4">
          <Link href="/user" passHref>
            <Button
              variant={
                tab === "profile" || !tab ? "ringHover" : "ringHoverOutline"
              }
              className="w-full"
            >
              Profile <UserIcon className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <Link href="/user?tab=billing" passHref>
            <Button
              variant={tab === "billing" ? "ringHover" : "ringHoverOutline"}
              className="w-full"
            >
              Billing <CreditCardIcon className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <Link href="/user?tab=security" passHref>
            <Button
              variant={tab === "security" ? "ringHover" : "ringHoverOutline"}
              className="w-full"
            >
              Security <ShieldIcon className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <Link href="/user?tab=api" passHref>
            <Button
              variant={tab === "api" ? "ringHover" : "ringHoverOutline"}
              className="w-full"
            >
              API <CodeIcon className="ml-2 w-6 h-6" />
            </Button>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and data.
          </p>
        </header>
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader className="h-12 w-12 animate-spin" />
            <p className="text-xl font-bold ml-4">Fetching Plan...</p>
          </div>
        ) : (
          <>{renderContent()}</>
        )}
      </main>
    </>
  );
};

export default UserDashboard;
