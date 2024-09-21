// src/components/auth/auth-footer.tsx

import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

interface AuthFooterProps {
  action: "signin" | "signup" | "reset-password" | "verify-email";
}

const AuthFooter: React.FC<AuthFooterProps> = ({ action }) => {
  if (action === "reset-password" || action === "verify-email") {
    return null;
  }

  return (
    <motion.div
      variants={footerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="text-center text-sm"
    >
      <span>
        {action === "signin"
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
      </span>
      <Link
        href={`/auth/${action === "signin" ? "signup" : "signin"}`}
        passHref
      >
        <Button variant="linkHover2">
          {action === "signin" ? "Sign up" : "Sign in"}
        </Button>
      </Link>
    </motion.div>
  );
};

export default AuthFooter;
