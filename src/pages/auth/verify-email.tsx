// src/pages/auth/verify-email.tsx

import AuthHeader from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NextSeo } from "next-seo";
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
    <>
      <NextSeo
        title="Verify Email - CashClips"
        description="Verify your email address to complete your sign-up or reset your password."
        canonical="https://cashclips.io/auth/verify-email"
        openGraph={{
          url: "https://cashclips.io/auth/verify-email",
          title: "Verify Email - CashClips",
          description:
            "Please verify your email address to complete your sign-up or reset your password on CashClips.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Verify Email",
            },
          ],
        }}
        twitter={{
          handle: "@cashclipsio",
          site: "@cashclipsio",
          cardType: "summary_large_image",
        }}
      />
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex min-h-[80vh] items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={contentVariants}
          className="w-full max-w-[320px] space-y-8 sm:max-w-md"
        >
          <AuthHeader
            action={
              verifyAction === "reset-password"
                ? "reset-password"
                : "verify-email"
            }
          />
          <p className="text-center text-sm">{getInstructionText()}</p>
          <p className="text-center text-sm">
            If you don not see the email, please check your spam folder. The
            recipient will be{" "}
            <strong className="text-primary">noreply@email.cashclip.io</strong>.
          </p>

          <Link href="/auth/signin" passHref>
            <Button variant="outline" className="mt-4 w-full">
              Return to Login
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </>
  );
};

export default VerifyEmailPage;
