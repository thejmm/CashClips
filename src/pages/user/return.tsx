// src/pages/user/return.tsx
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  Loader,
  Package,
  RefreshCcw,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import confetti from "canvas-confetti";
import { createClient } from "@/utils/supabase/component";
import { pricingConfig } from "@/components/landing/pricing";
import { useRouter } from "next/router";

interface SessionData {
  status: string;
  subscription_status: string | null;
  payment_status: string | null;
  user_data: UserData;
}

interface UserData {
  plan_name: string;
  plan_price: number;
  used_credits: number;
  total_credits: number;
  next_billing_date: string | null;
}

interface SubscriptionData {
  current_period_end: string;
  cancel_at_period_end: boolean;
}

const ReturnPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const supabase = createClient();

  const triggerFireworks = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const triggerSideCannons = () => {
    const end = Date.now() + 3 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session_id) {
        try {
          const sessionResponse = await axios.get(
            `/api/stripe/checkout-sessions?session_id=${session_id}`,
          );
          setSessionData(sessionResponse.data);
          setUserData(sessionResponse.data.user_data); // Update this line

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data: subscriptionData, error: subscriptionError } =
              await supabase
                .from("subscriptions")
                .select("current_period_end, cancel_at_period_end")
                .eq("user_id", user.id)
                .single();

            if (subscriptionError) throw subscriptionError;
            setSubscriptionData(subscriptionData);
          }

          setLoading(false);
        } catch (err) {
          console.error("Error fetching data:", err);
          setError("Failed to retrieve session status or user data.");
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [session_id, supabase]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && !error && sessionData?.status === "complete" && userData) {
      triggerFireworks();
      triggerSideCannons();
    }
  }, [loading, error, sessionData, userData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Loader className="w-12 h-12 animate-spin mb-4" />
        </motion.div>
        <Progress value={progress} className="w-[60%] max-w-xs" />
      </div>
    );
  }

  if (error || !sessionData || sessionData.status !== "complete" || !userData) {
    return (
      <motion.div
        className="flex items-center justify-center h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {error ? "Error" : "Payment Incomplete"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">
              {error ||
                "Your payment has not been completed. Please try again."}
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/pricing")}
            >
              Return to Pricing
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const planDetails = pricingConfig.plans.find(
    (plan) => plan.name === userData.plan_name,
  );

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full justify-center max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <motion.div
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <div className="rounded-full p-4 bg-green-100">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
          </motion.div>
          <CardTitle className="text-3xl font-bold mb-2">
            <motion.span variants={itemVariants}>
              Thank you for your purchase!
            </motion.span>
          </CardTitle>
          <motion.p className="text-gray-600" variants={itemVariants}>
            Your subscription is now active.
          </motion.p>
        </CardHeader>
        <CardContent>
          <motion.div
            className="justify-center grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={itemVariants}
          >
            <div className="space-y-6 flex flex-col items-center">
              <div className="flex items-center">
                <Package className="w-8 h-8 mr-4 text-blue-500" />
                <div className="text-center">
                  <p className="font-medium">Plan</p>
                  <p className="text-lg">{userData.plan_name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Zap className="w-8 h-8 mr-4 text-yellow-500" />
                <div className="text-center">
                  <p className="font-medium">Credits</p>
                  <p className="text-lg">{userData.total_credits}</p>
                </div>
              </div>
            </div>
            <div className="space-y-6 flex flex-col items-center">
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 mr-4 text-green-500" />
                <div className="text-center">
                  <p className="font-medium">Price</p>
                  <p className="text-lg">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(userData.plan_price / 100)}
                    /month
                  </p>
                </div>
              </div>
              {subscriptionData && (
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 mr-4 text-purple-500" />
                  <div className="text-center">
                    <p className="font-medium">Next Billing Date</p>
                    <p className="text-lg">
                      {new Date(
                        subscriptionData.current_period_end,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          {planDetails && (
            <motion.div className="mt-8" variants={itemVariants}>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {planDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
          <motion.div
            className="mt-12 flex justify-center"
            variants={itemVariants}
          >
            <Button
              onClick={() => router.push("/user/dashboard")}
              className="inline-flex items-center px-6 py-3 text-lg"
            >
              Go to Dashboard
              <ArrowRight className="ml-2" size={24} />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReturnPage;
