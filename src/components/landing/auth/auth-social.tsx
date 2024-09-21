// src/components/auth/auth-social.tsx

import { FaGithub, FaGoogle } from "react-icons/fa";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/component";
import { motion } from "framer-motion";
import { setLastSignInMethod } from "@/utils/supabase/last-used-method";

const socialVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -20 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface SocialSignInProps {
  action: "signin" | "signup";
  lastSignInMethod: string | null;
  setError: (error: string | null) => void;
}

const SocialSignIn: React.FC<SocialSignInProps> = ({
  action,
  lastSignInMethod,
  setError,
}) => {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const signInWithProvider = async (provider: "github" | "google") => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`,
        },
      });

      if (error) throw error;
      setLastSignInMethod(provider);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-2"
      variants={socialVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div variants={itemVariants} className="relative">
        <Button
          onClick={() => signInWithProvider("github")}
          variant="ringHover"
          disabled={loading}
          className="w-full"
        >
          <FaGithub className="mr-2 h-4 w-4" />
          {loading && lastSignInMethod === "github"
            ? "Processing..."
            : `${action === "signin" ? "Sign in" : "Sign up"} with GitHub`}
        </Button>
        {lastSignInMethod === "github" && action === "signin" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-full whitespace-nowrap ml-2 bg-accent px-2 py-1 rounded-md text-xs text-foreground/80 items-center"
          >
            <div className="absolute -left-1 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-accent border-b-[6px] border-b-transparent"></div>
            Last used
          </motion.div>
        )}
      </motion.div>
      <motion.div variants={itemVariants} className="relative">
        <Button
          onClick={() => signInWithProvider("google")}
          variant="ringHover"
          disabled={loading}
          className="w-full"
        >
          <FaGoogle className="mr-2 h-4 w-4" />
          {loading && lastSignInMethod === "google"
            ? "Processing..."
            : `${action === "signin" ? "Sign in" : "Sign up"} with Google`}
        </Button>
        {lastSignInMethod === "google" && action === "signin" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="hidden sm:flex absolute top-1/2 -translate-y-1/2 left-full whitespace-nowrap ml-2 bg-accent px-2 py-1 rounded-md text-xs text-foreground/80 items-center"
          >
            <div className="absolute -left-1 w-0 h-0 border-t-[6px] border-t-transparent border-r-[6px] border-r-accent border-b-[6px] border-b-transparent"></div>
            Last used
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SocialSignIn;
