// src/components/auth/auth-form.tsx

import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { motion } from "framer-motion";
import { setLastSignInMethod } from "@/utils/supabase/last-used-method";
import { useRouter } from "next/router";

const formVariants = {
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

type AuthAction = "signin" | "signup" | "reset-password" | "verify-email";

interface AuthFormProps {
  action: AuthAction;
  setError: (error: string | null) => void;
  lastSignInMethod: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  action,
  setError,
  lastSignInMethod,
}) => {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && action !== "verify-email") {
      setError("Email is required");
      return;
    }
    if (action !== "reset-password" && action !== "verify-email" && !password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (action) {
        case "signup":
          await handleSignUp();
          break;
        case "signin":
          await handleSignIn();
          break;
        case "reset-password":
          await handleResetPassword();
          break;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user && data.session) {
      setLastSignInMethod("email");
      router.push("/user");
    } else {
      router.push("/auth/verify-email");
    }
  };

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setLastSignInMethod("email");
    router.push("/user");
  };

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
    router.push("/auth/verify-email?action=reset-password");
  };

  return (
    <motion.form
      onSubmit={handleAuth}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={formVariants}
      className="space-y-4"
    >
      {action !== "verify-email" && (
        <>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </motion.div>
          {(action === "signin" || action === "signup") && (
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder={showPassword ? "Password123." : "●●●●●●●●●●●●"}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}
          {action === "signin" && (
            <motion.div variants={itemVariants}>
              <Link href="/auth/reset-password" passHref>
                <Button
                  type="button"
                  className="w-36 flex items-center mx-auto text-xs"
                  variant="linkHover2"
                >
                  Forgot password?
                </Button>
              </Link>
            </motion.div>
          )}
          <motion.div variants={itemVariants} className="relative">
            <Button
              type="submit"
              className="w-full"
              variant="ringHover"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : action === "signin" ? (
                "Sign In"
              ) : action === "signup" ? (
                "Sign Up"
              ) : (
                "Reset Password"
              )}
            </Button>
            {lastSignInMethod === "email" && action === "signin" && (
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
        </>
      )}
      {action === "reset-password" && (
        <motion.div variants={itemVariants}>
          <Link href="/auth/signin" passHref>
            <Button type="button" variant="outline" className="w-full">
              Return to Login
            </Button>
          </Link>
        </motion.div>
      )}
      {action === "verify-email" && (
        <motion.div variants={itemVariants}>
          <Link href="/auth/signin" passHref>
            <Button type="button" variant="outline" className="w-full">
              Return to Login
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.form>
  );
};

export default AuthForm;
