// src/components/auth/auth-form.tsx

import { AnimatePresence, motion } from "framer-motion";
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { createClient } from "@/utils/supabase/component";
import { setLastSignInMethod } from "@/utils/supabase/last-used-method";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters long" },
  { regex: /[a-z]/, text: "Contains lowercase letter" },
  { regex: /[A-Z]/, text: "Contains uppercase letter" },
  { regex: /\d/, text: "Contains number" },
  { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "Contains special character" },
];

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type FormData = z.infer<typeof schema>;

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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validRequirements, setValidRequirements] = useState<boolean[]>(
    new Array(passwordRequirements.length).fill(false),
  );
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [usedEmails, setUsedEmails] = useState<string[]>([]);
  const [email, setEmail] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch("password");

  useEffect(() => {
    const newValidRequirements = passwordRequirements.map((req) =>
      req.regex.test(password || ""),
    );
    setValidRequirements(newValidRequirements);
    setPasswordStrength(
      (newValidRequirements.filter(Boolean).length /
        passwordRequirements.length) *
        100,
    );
  }, [password]);

  useEffect(() => {
    const storedEmails = localStorage.getItem("usedEmails");
    if (storedEmails) {
      setUsedEmails(JSON.parse(storedEmails));
    }
  }, []);

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
      router.push("/user/dashboard");
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
    router.push("/user/dashboard");
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
              list="usedEmails"
              required
              aria-required="true"
            />
            <datalist id="usedEmails">
              {usedEmails.map((email) => (
                <option key={email} value={email} />
              ))}
            </datalist>
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </motion.div>
          {(action === "signin" || action === "signup") && (
            <motion.div variants={itemVariants} className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder={showPassword ? "Password123." : "●●●●●●●●●●●●"}
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
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
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              <AnimatePresence>
                {password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2"
                  >
                    {action === "signup" && (
                      <>
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
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          {action === "signin" && (
            <motion.div variants={itemVariants}>
              <Link href="/auth/reset-password" passHref>
                <Button
                  type="button"
                  className="mx-auto flex w-36 items-center text-xs"
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative flex items-center justify-center whitespace-nowrap rounded-md bg-accent px-2 py-1 text-xs text-foreground/80 md:absolute md:left-full md:top-1/2 md:ml-2 md:mt-0 md:-translate-y-1/2"
              >
                {/* Mobile tick */}
                <div className="absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[6px] border-l-[6px] border-r-[6px] border-b-accent border-l-transparent border-r-transparent md:hidden"></div>
                {/* Desktop tick */}
                <div className="absolute -left-1 top-1/2 hidden h-0 w-0 -translate-y-1/2 border-b-[6px] border-r-[6px] border-t-[6px] border-b-transparent border-r-accent border-t-transparent md:block"></div>
                Last used
              </motion.div>
            )}
          </motion.div>
        </>
      )}
      {(action === "reset-password" || action === "verify-email") && (
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
