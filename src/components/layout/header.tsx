// src/components/layout/sidebar.tsx

import { DashboardIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [addBorder, setAddBorder] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sticky) {
      const handleScroll = () => {
        setAddBorder(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [sticky]);

  return (
    <header
      className={cn(
        "top-0 px-2 z-50 mx-auto flex w-full items-center justify-between sm:px-10",
        sticky ? "sticky bg-background/20 backdrop-blur" : "relative",
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link
          className="flex items-center rounded-full p-1 my-2 justify-start gap-2 group/sidebar transition-all"
          href="/"
        >
          <img src="/logo.png" className="rounded-lg w-10 h-10" alt="Logo" />
          <p className="text-lg md:text-xl font-bold transition duration-150 whitespace-pre inline-block !p-0 !m-0">
            Cash Clips
          </p>
        </Link>
        <div className="gap-4 flex items-center z-[10]">
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
            "absolute w-full left-0 right-0 bottom-0 transition-opacity duration-300 ease-in-out",
            addBorder ? "opacity-100" : "opacity-0",
          )}
        />
      )}
    </header>
  );
}
