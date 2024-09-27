// src/components/auth/auth-social.tsx

import { FaGoogle, FaTwitch } from "react-icons/fa";
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

  const signInWithProvider = async (provider: "twitch" | "google") => {
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

  const renderLastUsedIndicator = (provider: "google" | "twitch") => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="relative mt-2 flex items-center justify-center whitespace-nowrap rounded-md bg-accent px-2 py-1 text-xs text-foreground/80 md:absolute md:left-full md:top-1/2 md:ml-2 md:mt-0 md:-translate-y-1/2"
    >
      {/* Mobile tick */}
      <div className="absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[6px] border-l-[6px] border-r-[6px] border-b-accent border-l-transparent border-r-transparent md:hidden"></div>
      {/* Desktop tick */}
      <div className="absolute -left-1 top-1/2 hidden h-0 w-0 -translate-y-1/2 border-b-[6px] border-r-[6px] border-t-[6px] border-b-transparent border-r-accent border-t-transparent md:block"></div>
      Last used
    </motion.div>
  );

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
        {lastSignInMethod === "google" &&
          action === "signin" &&
          renderLastUsedIndicator("google")}
      </motion.div>
      <motion.div variants={itemVariants} className="relative">
        <Button
          onClick={() => signInWithProvider("twitch")}
          variant="ringHover"
          disabled={loading}
          className="w-full"
        >
          <FaTwitch className="mr-2 h-4 w-4" />
          {loading && lastSignInMethod === "twitch"
            ? "Processing..."
            : `${action === "signin" ? "Sign in" : "Sign up"} with Twitch`}
        </Button>
        {lastSignInMethod === "twitch" &&
          action === "signin" &&
          renderLastUsedIndicator("twitch")}
      </motion.div>
    </motion.div>
  );
};

export default SocialSignIn;
