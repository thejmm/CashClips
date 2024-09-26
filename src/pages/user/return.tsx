// src/pages/user/return.tsx
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  CreditCard,
  Loader,
  Package,
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
}

interface UserData {
  plan_name: string;
  plan_price: number;
  page_limit: number;
  project_limit: number;
  api_key_limit: number;
  next_billing_date: string | null;
  subscription_status: string | null; // Now using this directly from user_data
}

const ReturnPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const supabase = createClient();

  // Fireworks effect
  const triggerFireworks = () => {
    const duration = 5 * 1000; // 5 seconds
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

  // Side cannons confetti effect
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
            `/api/stripe/checkout-sessions?session_id=${session_id}`
          );
          setSessionData(sessionResponse.data);

          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            const { data: userData, error: userError } = await supabase
              .from("user_data")
              .select("*")
              .eq("user_id", user.id)
              .single();

            if (userError) throw userError;
            setUserData(userData);
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
    (plan) => plan.name === userData.plan_name
  );

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <motion.div
            className="flex justify-center mb-6"
            variants={itemVariants}
          >
            <div className="rounded-full p-2 bg-green-100">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>
          <CardTitle className="text-3xl font-bold text-center mb-2">
            <motion.span variants={itemVariants}>
              Thank you for your purchase!
            </motion.span>
          </CardTitle>
          <motion.p
            className="text-center text-gray-600"
            variants={itemVariants}
          >
            Your subscription is now active.
          </motion.p>
        </CardHeader>
        <CardContent>
          <motion.div className="mt-8 space-y-4" variants={itemVariants}>
            <div className="flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-500" />
              <span className="font-medium">Plan:</span>
              <span className="ml-2">{userData.plan_name}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 mr-2 text-green-500" />
              <span className="font-medium">Price:</span>
              <span className="ml-2">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(userData.plan_price / 100)}
                /month
              </span>
            </div>
            {userData.next_billing_date && (
              <div className="flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-purple-500" />
                <span className="font-medium">Next Billing Date:</span>
                <span className="ml-2">
                  {new Date(userData.next_billing_date).toLocaleDateString()}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <span className="font-medium">Subscription Status:</span>
              <span className="ml-2 capitalize">
                {userData.subscription_status}
              </span>
            </div>
            {planDetails && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Plan Features:</h3>
                <ul className="list-disc list-inside">
                  {planDetails.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
          <motion.div
            className="mt-12 flex justify-center"
            variants={itemVariants}
          >
            <Button
              onClick={() => router.push("/user")}
              className="inline-flex items-center px-6 py-3"
            >
              Go to Dashboard
              <ArrowRight className="ml-2" size={18} />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReturnPage;
