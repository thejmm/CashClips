// src/components/layout/sidebar.tsx

import React, { useState } from "react";

import AuthButton from "../user/components/auth-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface DashboardLayoutProps {
  user: User;
}

export default function Header({ user }: DashboardLayoutProps) {
  return (
    <>
      <header className="h-[8vh] top-0 z-20 mx-auto flex w-full items-center justify-between p-4 sm:px-10">
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
      </header>
    </>
  );
}
