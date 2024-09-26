// src/pages/login.tsx
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { FaGoogle, FaTwitch } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import {
  getLastSignInMethod,
  setLastSignInMethod,
} from "@/utils/supabase/last-used-method";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

type AuthStage = "signIn" | "signUp" | "resetPassword" | "checkEmail";
type AuthAction = "signin" | "signup" | "resetpassword";
type SignInMethod = "email" | "google" | "twitch" | null;

const pageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  in: { opacity: 1, scale: 1 },
  out: { opacity: 0, scale: 1.2 },
};

const pageTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
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

interface PasswordRequirement {
  regex: RegExp;
  text: string;
}

const passwordRequirements: PasswordRequirement[] = [
  { regex: /.{8,}/, text: "At least 8 characters long" },
  { regex: /[a-z]/, text: "Contains lowercase letter" },
  { regex: /[A-Z]/, text: "Contains uppercase letter" },
  { regex: /\d/, text: "Contains number" },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "Contains special character" },
];

const LoginPage: React.FC = () => {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSignInMethod, setLastSignInMethodState] =
    useState<SignInMethod | null>(null);

  const queryAuthStage = (router.query.authStage as AuthStage) || "signIn";
  const queryAuthAction = (router.query.authAction as AuthAction) || "signin";

  const [authStage, setAuthStage] = useState<AuthStage>(queryAuthStage);
  const [authAction, setAuthAction] = useState<AuthAction>(queryAuthAction);

  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validRequirements, setValidRequirements] = useState<boolean[]>(
    new Array(passwordRequirements.length).fill(false),
  );

  useEffect(() => {
    setLastSignInMethodState(getLastSignInMethod());
  }, []);

  useEffect(() => {
    setError(null);
  }, [authStage]);

  useEffect(() => {
    const newValidRequirements = passwordRequirements.map((req) =>
      req.regex.test(password),
    );
    setValidRequirements(newValidRequirements);
    setPasswordStrength(
      (newValidRequirements.filter(Boolean).length /
        passwordRequirements.length) *
        100,
    );
  }, [password]);

  const updateURL = (newAuthStage: AuthStage, newAuthAction: AuthAction) => {
    setAuthStage(newAuthStage);
    setAuthAction(newAuthAction);
    router.push(
      {
        pathname: "/login",
        query: { authStage: newAuthStage, authAction: newAuthAction },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleAuth = async () => {
    if (!email) {
      setError("Email is required.");
      return;
    }

    if (authStage !== "resetPassword" && !password) {
      setError("Password is required.");
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
          if (signInError) throw new Error(signInError.message);
          setLastSignInMethod("email");
          router.push("/user/dashboard");
          break;
        case "signUp":
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          if (signUpError) throw new Error(signUpError.message);
          updateURL("checkEmail", "signup");
          break;
        case "resetPassword":
          const { error: resetError } =
            await supabase.auth.resetPasswordForEmail(email);
          if (resetError) throw new Error(resetError.message);
          updateURL("checkEmail", "resetpassword");
          break;
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: SignInMethod) => {
    if (provider === "email") {
      return handleAuth();
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/user/dashboard`,
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

  // Update the SignInMethod type
  type SignInMethod = "email" | "google" | "twitch";

  // Update the renderSocialButtons function
  const renderSocialButtons = () => (
    <motion.div variants={formVariants} className="space-y-2">
      <motion.div variants={itemVariants}>
        <Button
          type="button"
          className="flex w-full items-center justify-center"
          onClick={() => handleSocialLogin("google")}
          disabled={loading}
        >
          <FaGoogle className="mr-2" />
          Continue with Google
        </Button>
      </motion.div>
      <motion.div variants={itemVariants}>
        <Button
          type="button"
          className="flex w-full items-center justify-center"
          onClick={() => handleSocialLogin("twitch")}
          disabled={loading}
        >
          <FaTwitch className="mr-2" />
          Continue with Twitch
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderPasswordStrength = () => (
    <motion.div
      className="mt-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${passwordStrength}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <ul className="mt-2 space-y-1">
        {passwordRequirements.map((req, index) => (
          <motion.li
            key={index}
            className="flex items-center text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {validRequirements[index] ? (
              <Check className="mr-2 h-4 w-4 text-primary" />
            ) : (
              <X className="mr-2 h-4 w-4 text-destructive" />
            )}
            {req.text}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

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
            {authAction === "signup"
              ? "Please check your email to verify your account."
              : "Please check your email for further instructions to reset your password."}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button onClick={() => updateURL("signIn", "signin")}>
              Back to Sign In
            </Button>
          </motion.div>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={formVariants}
        className="space-y-4 overflow-hidden"
      >
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
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
                  placeholder={showPassword ? "Password123!" : "●●●●●●●●●●●●"}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  aria-required="true"
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
              <AnimatePresence>
                {password && renderPasswordStrength()}
              </AnimatePresence>
            </motion.div>
          )}
          {authStage === "signIn" && (
            <motion.div variants={itemVariants}>
              <Button
                type="button"
                className="mx-auto flex w-36 items-center text-xs"
                variant="linkHover2"
                onClick={() => updateURL("resetPassword", "resetpassword")}
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
            {lastSignInMethod && authStage === "signIn" && (
              <motion.div
                initial={{ opacity: 0, x: -20, y: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute left-full top-1/2 ml-2 hidden -translate-y-1/2 items-center whitespace-nowrap rounded-md bg-accent px-2 py-1 text-xs text-foreground/80 sm:flex"
              >
                <div className="absolute -left-1 h-0 w-0 border-b-[6px] border-r-[6px] border-t-[6px] border-b-transparent border-r-accent border-t-transparent"></div>
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
                onClick={() => updateURL("signIn", "signin")}
              >
                Return to Login
              </Button>
            </motion.div>
          )}
        </motion.form>
        {authStage !== "resetPassword" && (
          <>
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </motion.div>
            {renderSocialButtons()}
          </>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="flex h-screen items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      <div className="w-full max-w-[320px] space-y-8 overflow-hidden sm:max-w-md">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formVariants}
          className="text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl font-bold">
            {authStage === "signIn"
              ? "Welcome back"
              : authStage === "signUp"
                ? "Create an account"
                : authStage === "resetPassword"
                  ? "Reset Password"
                  : authAction === "signup"
                    ? "Verify Your Email"
                    : "Check Your Email"}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="mt-2 text-sm text-muted-foreground"
          >
            {authStage === "signIn"
              ? "Enter your credentials to access your account"
              : authStage === "signUp"
                ? "Enter your details to create your account"
                : authStage === "resetPassword"
                  ? "Enter your email to reset your password"
                  : authAction === "signup"
                    ? "We've sent you an email to verify your account"
                    : "Check your email for password reset instructions"}
          </motion.p>
        </motion.div>
        <AnimatePresence mode="wait" initial={false}>
          {renderForm()}
        </AnimatePresence>
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
                  updateURL(
                    authStage === "signIn" ? "signUp" : "signIn",
                    authStage === "signIn" ? "signup" : "signin",
                  )
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
