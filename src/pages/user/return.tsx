// src/pages/user/return.tsx

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle, Loader } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { useRouter } from "next/router";

const ReturnPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  const [sessionStatus, setSessionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const checkSessionStatus = async () => {
      if (session_id) {
        try {
          const response = await axios.get(
            `/api/stripe/checkout-sessions?session_id=${session_id}`,
          );
          setSessionStatus(response.data.status);
          setLoading(false);
        } catch (err) {
          setError("Failed to retrieve session status.");
          setLoading(false);
        }
      }
    };

    checkSessionStatus();
  }, [session_id]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

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

  if (error || sessionStatus !== "complete") {
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
            <div className="flex justify-between items-center">
              <span className="font-medium">Status</span>
              <span className="text-green-600">Payment Successful</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
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
