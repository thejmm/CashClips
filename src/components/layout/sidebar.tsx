// src/components/layout/sidebar.tsx
import { Film, HomeIcon, PlusCircle, Settings } from "lucide-react";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar-side";

import AuthButton from "../user/components/auth-button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}

export default function DashboardLayout({
  user,
  children,
  title,
  icon,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const links = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon className="h-7 w-7 flex-shrink-0" />,
    },
    {
      label: "Create Clips",
      href: "/user/create",
      icon: <PlusCircle className="h-7 w-7 flex-shrink-0" />,
    },
    {
      label: "Created Clips",
      href: "/user/created",
      icon: <Film className="h-7 w-7 flex-shrink-0" />,
    },
    {
      label: "Settings",
      href: "/user/settings",
      icon: <Settings className="h-7 w-7 flex-shrink-0" />,
    },
  ];

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
          <div className="z-[10]">
            <AuthButton initialUser={user} />
          </div>
        </div>
      </header>

      <div
        className={cn(
          "flex flex-col md:flex-row w-full flex-1 mx-auto",
          "h-full",
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody>
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={cn(router.pathname === link.href && "bg-accent")}
                  />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>
        <div className="flex flex-1">
          <div className="p-2 rounded-tl-2xl border border-border bg-dashboard flex flex-col gap-2 flex-1 w-full h-full">
            <div className="p-2 flex flex-row items-center">
              {React.cloneElement(icon as React.ReactElement, {
                className: "w-8 h-8 inline-block mr-2",
              })}
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
            <Separator className="mb-2" />

            <ScrollArea className="h-[82vh] w-full justify-center mx-auto">
              {children}
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
