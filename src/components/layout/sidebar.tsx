// src/components/layout/sidebar.tsx

import {
  Film,
  LayoutDashboardIcon,
  Loader,
  PlusCircle,
  Settings,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar-side";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

interface DashboardLayoutProps {
  user: User;
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
  checkSubscription?: boolean;
}

export default function DashboardLayout({
  user,
  children,
  title,
  icon,
  checkSubscription = false,
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const [isActiveSubscription, setIsActiveSubscription] = useState<
    null | boolean
  >(null);
  const [loading, setLoading] = useState(checkSubscription);
  const router = useRouter();
  const supabase = createClient();

  const links = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: <LayoutDashboardIcon className="h-7 w-7 flex-shrink-0" />,
    },
    {
      label: "Create Clips",
      href: "/user/create",
      icon: <PlusCircle className="h-7 w-7 flex-shrink-0" />,
    },
  ];

  const settingsLink = {
    label: "Settings",
    href: "/user/settings",
    icon: <Settings className="h-7 w-7 flex-shrink-0" />,
  };

  const fetchSubscriptionStatus = async () => {
    if (!checkSubscription) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      setIsActiveSubscription(data?.status === "active");
    } catch (error) {
      console.error("Error fetching subscription data:", error);
      setIsActiveSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checkSubscription) {
      fetchSubscriptionStatus();
    }
  }, [user.id, checkSubscription]);

  return (
    <>
      <div
        className={cn(
          "mx-auto flex w-full flex-1 flex-col md:flex-row",
          "h-full",
        )}
      >
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody>
            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
              {/* Links Section */}
              <div className="flex flex-1 flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={cn(router.pathname === link.href && "bg-accent")}
                  />
                ))}
              </div>

              <div className="mt-auto pt-4">
                <Separator className="mb-4" />
                <SidebarLink
                  link={settingsLink}
                  className={cn(
                    router.pathname === settingsLink.href && "bg-accent",
                    "sticky bottom-0 left-0 right-0",
                  )}
                />
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex flex-1">
          <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-border bg-dashboard p-2">
            <div className="flex flex-row items-center p-2">
              {React.cloneElement(icon as React.ReactElement, {
                className: "w-8 h-8 inline-block mr-2",
              })}
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
            <Separator className="mb-2" />

            <ScrollArea className="mx-auto h-full w-full justify-center md:min-h-[85vh]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-12 w-12 animate-spin" />
                  <p className="ml-4 text-xl font-bold">Fetching Plan...</p>
                </div>
              ) : checkSubscription && !isActiveSubscription ? (
                <div className="flex h-full min-h-96 flex-col items-center justify-center text-center">
                  <p className="mb-4 text-lg font-semibold">
                    You do not have an active plan. Please upgrade your plan to
                    use this feature.
                  </p>
                  <Link href="/pricing" passHref>
                    <Button variant="ringHover">Go to Pricing</Button>
                  </Link>
                </div>
              ) : (
                children
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
