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
  subscription_status: string | null;
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

  const triggerMoneyFireworks = () => {
    const emojis = ["💸", "💵", "🤑", "🪙", "💰"];
    const createEmojiElement = (emoji: string | null) => {
      const element = document.createElement("div");
      element.textContent = emoji;
      element.style.position = "fixed";
      element.style.fontSize = "2rem";
      element.style.zIndex = "9999";
      element.style.pointerEvents = "none";
      element.style.top = `${Math.random() * 100}%`;
      element.style.left = `${Math.random() * 100}%`;
      return element;
    };

    const animateEmoji = (element: HTMLDivElement) => {
      document.body.appendChild(element);
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;
      const endY = window.innerHeight + 100;

      element.style.transform = `translate(${startX}px, ${startY}px)`;
      element.style.transition = `transform 5s ease-out, opacity 5s ease-out`;
      element.style.opacity = "0";

      requestAnimationFrame(() => {
        element.style.transform = `translate(${startX}px, ${endY}px)`;
      });

      setTimeout(() => {
        document.body.removeChild(element);
      }, 5000);
    };

    // Fire off 50 emoji particles for fireworks
    for (let i = 0; i < 50; i++) {
      const emoji = createEmojiElement(
        emojis[Math.floor(Math.random() * emojis.length)],
      );
      animateEmoji(emoji);
    }
  };

  const triggerMoneySideCannons = () => {
    const emojis = ["💸", "💵", "🤑", "🪙", "💰"];
    const createSideCannonElement = (emoji: string | null) => {
      const element = document.createElement("div");
      element.textContent = emoji;
      element.style.position = "fixed";
      element.style.fontSize = "3rem";
      element.style.zIndex = "9999";
      element.style.pointerEvents = "none";
      element.style.left = `0px`; // Left side of the screen
      element.style.bottom = `50%`; // Middle of the screen
      return element;
    };

    const animateSideCannon = (element: HTMLDivElement) => {
      document.body.appendChild(element);
      const endX = window.innerWidth + 100; // Move to the right side of the screen
      const endY = Math.random() * window.innerHeight;

      element.style.transform = `translate(0px, 0px)`;
      element.style.transition = `transform 3s ease-in-out, opacity 3s ease-in-out`;
      element.style.opacity = "0";

      requestAnimationFrame(() => {
        element.style.transform = `translate(${endX}px, ${endY}px)`;
      });

      setTimeout(() => {
        document.body.removeChild(element);
      }, 3000);
    };

    // Fire off 20 emoji particles for side cannons
    for (let i = 0; i < 20; i++) {
      const emoji = createSideCannonElement(
        emojis[Math.floor(Math.random() * emojis.length)],
      );
      animateSideCannon(emoji);
    }
  };

  const triggerMoneySnow = () => {
    const emojis = ["💸", "💵", "🤑", "🪙", "💰"];
    const createSnowElement = (emoji: string | null) => {
      const element = document.createElement("div");
      element.textContent = emoji;
      element.style.position = "fixed";
      element.style.fontSize = "2.5rem";
      element.style.zIndex = "9999";
      element.style.pointerEvents = "none";
      element.style.top = "-50px"; // Start from above the screen
      element.style.left = `${Math.random() * 100}%`; // Random horizontal position
      return element;
    };

    const animateSnow = (element: HTMLDivElement) => {
      document.body.appendChild(element);
      const endY = window.innerHeight + 100; // End position below the screen

      element.style.transition = `transform 10s linear, opacity 10s ease-out`;
      element.style.opacity = "0";

      requestAnimationFrame(() => {
        element.style.transform = `translateY(${endY}px)`;
      });

      setTimeout(() => {
        document.body.removeChild(element);
      }, 10000); // Remove after the animation
    };

    // Fire off 30 emoji particles for snow effect
    for (let i = 0; i < 30; i++) {
      const emoji = createSnowElement(
        emojis[Math.floor(Math.random() * emojis.length)],
      );
      animateSnow(emoji);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (session_id) {
        try {
          const sessionResponse = await axios.get(
            `/api/stripe/checkout-sessions?session_id=${session_id}`,
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
      triggerMoneyFireworks();
      triggerMoneySideCannons();
      triggerMoneySnow();
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
      <div className="flex h-screen flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Loader className="mb-4 h-12 w-12 animate-spin" />
        </motion.div>
        <Progress value={progress} className="w-[60%] max-w-xs" />
      </div>
    );
  }

  if (error || !sessionData || sessionData.status !== "complete" || !userData) {
    return (
      <motion.div
        className="flex h-screen items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold">
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
      className="flex min-h-screen items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <motion.div
            className="mb-6 flex justify-center"
            variants={itemVariants}
          >
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </motion.div>
          <CardTitle className="mb-2 text-center text-3xl font-bold">
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
              <Package className="mr-2 h-6 w-6 text-blue-500" />
              <span className="font-medium">Plan:</span>
              <span className="ml-2">{userData.plan_name}</span>
            </div>
            <div className="flex items-center">
              <CreditCard className="mr-2 h-6 w-6 text-green-500" />
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
                <Calendar className="mr-2 h-6 w-6 text-purple-500" />
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
                <h3 className="mb-2 font-medium">Plan Features:</h3>
                <ul className="list-inside list-disc">
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
              onClick={() => router.push("/user/dashboard")}
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
