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
  checkSubscription = false, // Default to false
}: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);
  const [isActiveSubscription, setIsActiveSubscription] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(checkSubscription); // Only set loading if we check the subscription
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

            <ScrollArea className="h-full md:min-h-[85vh] w-full justify-center mx-auto">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-12 w-12 animate-spin" />
                  <p className="text-xl font-bold ml-4">Fetching Plan...</p>
                </div>
              ) : checkSubscription && !isActiveSubscription ? (
                <div className="flex flex-col text-center items-center justify-center h-full min-h-96">
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
