// src/components/auth/auth-button.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRightIcon, LogOut, UserIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { useRouter } from "next/router";

interface AuthButtonProps {
  user: User | null;
}

const AuthButton: React.FC<AuthButtonProps> = ({ user: initialUser }) => {
  const router = useRouter();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (response.ok) {
        window.location.href = "/";
      } else {
        console.error("Sign out failed");
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handlePopoverClose = () => setIsPopoverOpen(false);

  if (user) {
    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full border rounded-full p-2 justify-center text-sm font-semibold"
          >
            <Avatar className="mr-2 h-8 w-8">
              <AvatarImage
                fetchPriority="high"
                className="rounded-full"
                src={user.user_metadata.avatar_url}
                alt={user.user_metadata.name || "User avatar"}
              />
              <AvatarFallback>
                {user.email?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-left font-normal">
              {user.user_metadata.name
                ? user.user_metadata.name.length > 12
                  ? `${user.user_metadata.name.slice(0, 12)}...`
                  : user.user_metadata.name
                : user.email && user.email.length > 12
                  ? `${user.email.slice(0, 12)}...`
                  : user.email}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[999]" align="center">
          <div className="flex flex-row space-y-1 p-2">
            <Avatar className="mr-2">
              <AvatarImage
                className="w-10 h-10 rounded-full border border-black dark:border-white"
                src={
                  user.user_metadata.picture || user.user_metadata.avatar_url
                }
                alt={user.user_metadata.name || "User"}
              />
              <AvatarFallback className="w-10 h-10 rounded-full">
                {user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <p className="text-sm font-medium">
                {user.email
                  ? user.email.charAt(0).toUpperCase() +
                    user.email.slice(1).toLowerCase()
                  : "Email not available"}
              </p>
              <p className="text-xs text-muted-foreground">
                {user.email || "User"}
              </p>
            </div>
          </div>
          <Separator className="my-2" />
          <Link href="/user" passHref>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handlePopoverClose}
            >
              <UserIcon className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Link href="/auth/signin" passHref>
      <Button className="flex group rounded-full" variant="outline">
        Get Started
        <ChevronRightIcon className="size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
      </Button>
    </Link>
  );
};

export default AuthButton;
