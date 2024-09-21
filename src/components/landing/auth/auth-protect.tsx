import React, { useEffect, useRef, useState } from "react";

import { AuthModal } from "@/components/landing/auth/auth-modal";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

interface AuthProtectedToolProps {
  children: React.ReactNode;
}

const AuthProtectedTool: React.FC<AuthProtectedToolProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const previousPageRef = useRef<string | null>(null);

  useEffect(() => {
    previousPageRef.current = document.referrer || "/";
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setIsAuthModalOpen(true);
      }
    };
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setIsAuthModalOpen(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
  };

  const handleReturnToPreviousPage = () => {
    router.push(previousPageRef.current || "/");
  };

  if (!user) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => {}}
            onSuccess={handleAuthSuccess}
            preventClose={true}
            showReturnButton={true}
            onReturn={handleReturnToPreviousPage}
            returnButtonText="Return"
          />
        </div>
        <div className="opacity-50 pointer-events-none">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProtectedTool;
