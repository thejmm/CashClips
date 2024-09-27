// src/pages/auth/[action].tsx

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import AuthFooter from "@/components/auth/auth-footer";
import AuthForm from "@/components/auth/auth-form";
import AuthHeader from "@/components/auth/auth-header";
import { Separator } from "@/components/ui/separator";
import SocialSignIn from "@/components/auth/auth-social";
import { getLastSignInMethod } from "@/utils/supabase/last-used-method";
import { useRouter } from "next/router";

const pageVariants = {
  initial: { opacity: 0, scale: 0.95 },
  in: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  out: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

type AuthAction = "signin" | "signup" | "reset-password" | "verify-email";

const isValidAction = (
  action: string | string[] | undefined,
): action is AuthAction => {
  return (
    typeof action === "string" &&
    ["signin", "signup", "reset-password", "verify-email"].includes(action)
  );
};

const AuthPage = () => {
  const router = useRouter();
  const { action: queryAction } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [lastSignInMethod, setLastSignInMethod] = useState<string | null>(null);

  useEffect(() => {
    setLastSignInMethod(getLastSignInMethod());
  }, []);

  useEffect(() => {
    setError(null);
  }, [queryAction]);

  if (!isValidAction(queryAction)) {
    return <div>Invalid action</div>;
  }

  const action: AuthAction = queryAction;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={action}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          variants={contentVariants}
          className="w-full max-w-[320px] sm:max-w-md space-y-8"
        >
          <AuthHeader action={action} />
          <AuthForm
            action={action}
            setError={setError}
            lastSignInMethod={lastSignInMethod}
          />
          {(action === "signin" || action === "signup") && (
            <>
              <Separator className="my-8" />
              <SocialSignIn
                action={action}
                lastSignInMethod={lastSignInMethod}
                setError={setError}
              />
            </>
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
          <AuthFooter action={action} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthPage;
