// src/pages/auth/verify-email.tsx

import AuthHeader from "@/components/landing/auth/auth-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.5 } },
};

type VerifyAction = "signup" | "reset-password";

const VerifyEmailPage = () => {
  const router = useRouter();
  const { action } = router.query;

  const verifyAction: VerifyAction =
    action === "reset-password" ? "reset-password" : "signup";

  const getInstructionText = () => {
    switch (verifyAction) {
      case "signup":
        return "We've sent a verification link to your email address. Please check your inbox and click the link to activate your account.";
      case "reset-password":
        return "We've sent a password reset link to your email address. Please check your inbox and click the link to set a new password.";
      default:
        return "Please check your email for further instructions.";
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        variants={contentVariants}
        className="w-full max-w-[320px] sm:max-w-md space-y-8"
      >
        <AuthHeader
          action={
            verifyAction === "reset-password"
              ? "reset-password"
              : "verify-email"
          }
        />
        <p className="text-center text-sm text-primary/60">
          {getInstructionText()}
        </p>
        <p className="text-center text-sm text-primary/60">
          If you dont see the email, please check your spam folder.
        </p>
        <Link href="/auth/signin" passHref>
          <Button variant="outline" className="mt-4 w-full">
            Return to Login
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default VerifyEmailPage;
