// src/components/layout/sidebar.tsx
"use client";

import {
  Film,
  HomeIcon,
  ListStartIcon,
  PlusCircle,
  Settings,
  Settings2Icon,
} from "lucide-react";
import React, { useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar-side";

import { CardStackIcon } from "@radix-ui/react-icons";
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
  );
}
