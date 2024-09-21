// src/components/landing/auth/auth-modal.tsx

import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaGithub, FaGoogle } from "react-icons/fa";
import React, { useState } from "react";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/component";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const authSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preventClose?: boolean;
  showReturnButton?: boolean;
  onReturn?: () => void;
  returnButtonText?: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  preventClose = false,
  showReturnButton = false,
  onReturn,
  returnButtonText = "Return Home",
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit = async (data: AuthFormData) => {
    setError(null);
    try {
      const { error } = isSignUp
        ? await supabase.auth.signUp(data)
        : await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      reset();
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSocialAuth = async (provider: "github" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleClose = () => {
    if (!preventClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent
            className="sm:max-w-[425px] overflow-visible"
            hideCloseButton={preventClose}
          >
            {showReturnButton && (
              <motion.div
                className="absolute -top-16"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={buttonVariants}
                key={isSignUp ? "signup" : "signin"}
              >
                <Button className="rounded-full shadow-lg" onClick={onReturn}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> {returnButtonText}
                </Button>
              </motion.div>
            )}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInUp}
              key={isSignUp ? "signup" : "signin"}
            >
              <DialogHeader>
                <DialogTitle>{isSignUp ? "Sign Up" : "Sign In"}</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <motion.div variants={fadeInUp}>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                  />
                  {errors.password && (
                    <motion.p
                      className="text-red-500 text-sm mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </motion.div>
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div variants={fadeInUp}>
                  <Button type="submit" className="w-full">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </Button>
                </motion.div>
              </form>
              <motion.div
                className="mt-4 flex flex-col space-y-2"
                variants={fadeInUp}
              >
                <Button
                  onClick={() => handleSocialAuth("github")}
                  className="w-full"
                  variant="outline"
                >
                  <FaGithub className="mr-2 h-4 w-4" /> Continue with GitHub
                </Button>
                <Button
                  onClick={() => handleSocialAuth("google")}
                  className="w-full"
                  variant="outline"
                >
                  <FaGoogle className="mr-2 h-4 w-4" /> Continue with Google
                </Button>
              </motion.div>
              <motion.div className="text-center mt-4" variants={fadeInUp}>
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-primary hover:underline"
                >
                  {isSignUp
                    ? "Already have an account? Sign In"
                    : "Don't have an account? Sign Up"}
                </button>
              </motion.div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
