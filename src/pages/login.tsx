//  src/pages/index.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  getLastSignInMethod,
  setLastSignInMethod,
} from "@/utils/supabase/last-used-method";

import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

type AuthStage = "signIn" | "signUp" | "resetPassword" | "checkEmail";
type AuthAction = "signin" | "signup" | "resetpassword";
type SignInMethod = "google" | "email" | null;

const pageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.2 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const formVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: -50 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LoginPage: React.FC = () => {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authStage, setAuthStage] = useState<AuthStage>("signIn");
  const [authAction, setAuthAction] = useState<AuthAction>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSignInMethod, setLastSignInMethodState] =
    useState<SignInMethod>(null);

  useEffect(() => {
    setLastSignInMethodState(getLastSignInMethod());
  }, []);

  useEffect(() => {
    setError(null);
  }, [authStage]);

  const handleAuth = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (authStage !== "resetPassword" && !password) {
      setError("Password is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      switch (authStage) {
        case "signIn":
          const { error: signInError } = await supabase.auth.signInWithPassword(
            { email, password },
          );
          if (signInError) throw signInError;
          setLastSignInMethod("email");
          router.push("/");
          break;
        case "signUp":
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          if (signUpError) throw signUpError;
          setAuthAction("signup");
          setAuthStage("checkEmail");
          break;
        case "resetPassword":
          const { error: resetError } =
            await supabase.auth.resetPasswordForEmail(email);
          if (resetError) throw resetError;
          setAuthAction("resetpassword");
          setAuthStage("checkEmail");
          break;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `https://wjcnnahfbsckdkylfslb.supabase.co/auth/v1/callback`,
        },
      });
      if (error) throw error;
      setLastSignInMethod("google");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (authStage === "checkEmail") {
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={formVariants}
          className="text-center"
        >
          <motion.p variants={itemVariants} className="mb-4">
            Please check your email for further instructions to{" "}
            {authAction === "signup"
              ? "complete your registration"
              : "reset your password"}
            .
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button onClick={() => setAuthStage("signIn")}>
              Back to Sign In
            </Button>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleAuth();
        }}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
        className="space-y-4"
      >
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
        {authStage !== "resetPassword" && (
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
        {authStage === "signIn" && (
          <motion.div variants={itemVariants}>
            <Button
              type="button"
              className="w-36 flex items-center mx-auto text-xs"
              variant="linkHover2"
              onClick={() => setAuthStage("resetPassword")}
            >
              Forgot password?
            </Button>
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
            ) : authStage === "signIn" ? (
              "Sign In"
            ) : authStage === "signUp" ? (
              "Sign Up"
            ) : (
              "Reset Password"
            )}
          </Button>
          {lastSignInMethod === "email" && authStage === "signIn" && (
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
        {authStage === "resetPassword" && (
          <motion.div variants={itemVariants}>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setAuthStage("signIn")}
            >
              Return to Login
            </Button>
          </motion.div>
        )}
      </motion.form>
    );
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-[320px] sm:max-w-md space-y-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold">
            {authStage === "signIn"
              ? "Sign In"
              : authStage === "signUp"
                ? "Sign Up"
                : "Reset Password"}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-sm text-primary/60"
          >
            {authStage === "signIn"
              ? "Enter your credentials to access your account"
              : authStage === "signUp"
                ? "Create an account to get started"
                : "Enter your email to reset your password"}
          </motion.p>
        </motion.div>
        <AnimatePresence mode="wait" initial={false}>
          {renderForm()}
        </AnimatePresence>
        {(authStage === "signIn" || authStage === "signUp") && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
          >
            <Separator className="mb-8" />
            <div className="flex flex-col gap-2">
              <motion.div variants={itemVariants} className="relative">
                <Button
                  onClick={signInWithGoogle}
                  variant="ringHover"
                  disabled={loading}
                  className="w-full"
                >
                  <IconBrandGoogle className="mr-2 h-4 w-4" />
                  Sign in with Google
                </Button>
                {lastSignInMethod === "google" && authStage === "signIn" && (
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
            </div>
          </motion.div>
        )}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
        {(authStage === "signIn" || authStage === "signUp") && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="text-center text-sm"
          >
            <motion.span variants={itemVariants}>
              {authStage === "signIn"
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
            </motion.span>
            <motion.span variants={itemVariants}>
              <Button
                variant="linkHover2"
                onClick={() =>
                  setAuthStage(authStage === "signIn" ? "signUp" : "signIn")
                }
              >
                {authStage === "signIn" ? "Sign up" : "Sign in"}
              </Button>
            </motion.span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LoginPage;