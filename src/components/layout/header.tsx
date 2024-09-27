// src/components/layout/sidebar.tsx

import React, { useEffect, useState } from "react";

import AuthButton from "../user/components/auth-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  user: User;
  sticky?: boolean;
}

export default function Header({ user, sticky = false }: DashboardLayoutProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    if (sticky) {
      const handleScroll = () => {
        setHasScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [sticky]);

  return (
    <header
      className={cn(
        "top-0 z-50 mx-auto flex w-full items-center justify-between px-2 transition-all duration-300 sm:px-10",
        sticky ? "sticky bg-background/20 backdrop-blur" : "relative",
        hasScrolled ? "border-b" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          className="group/sidebar my-2 flex items-center justify-start gap-2 rounded-full p-1 transition-all"
          href="/"
        >
          <img src="/logo.png" className="h-10 w-10 rounded-lg" alt="Logo" />
          <p className="!m-0 hidden whitespace-pre !p-0 text-lg font-bold transition duration-150 md:inline-block md:text-xl">
            Cash Clips
          </p>
        </Link>
        <div className="z-[10] flex items-center gap-4">
          <Link href="/pricing" passHref>
            <Button variant="linkHover2">Pricing</Button>
          </Link>
          <AuthButton initialUser={user} />
        </div>
      </div>

      {/* Bottom border when scrolling */}
      {sticky && (
        <hr
          className={cn(
            "absolute bottom-0 left-0 right-0 w-full transition-opacity duration-300 ease-in-out",
            hasScrolled ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </header>
  );
}
