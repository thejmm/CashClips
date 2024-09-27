// src/components/auth/auth-header.tsx

import React from "react";
import { motion } from "framer-motion";

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

interface AuthHeaderProps {
  action: "signin" | "signup" | "reset-password" | "verify-email";
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ action }) => {
  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center"
    >
      <h2 className="text-3xl font-bold">
        {action === "signin"
          ? "Sign In"
          : action === "signup"
            ? "Sign Up"
            : action === "reset-password"
              ? "Reset Password"
              : "Verify Email"}
      </h2>
      <p className="mt-2 text-sm text-primary/60">
        {action === "signin"
          ? "Enter your credentials to access your account"
          : action === "signup"
            ? "Create an account to get started"
            : action === "reset-password"
              ? "Enter your email to reset your password"
              : "Check your email for the verification link"}
      </p>
    </motion.div>
  );
};

export default AuthHeader;
