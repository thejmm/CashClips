// src/components/user/user-button.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Film,
  Home,
  LogOut,
  PlusCircle,
  Settings,
} from "lucide-react";
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

const AuthButton = ({ initialUser }: { initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!initialUser) {
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
    }
  }, [initialUser, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out error:", error);
    }
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  if (user) {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ringHover"
            className="w-full rounded-full px-6 text-sm font-semibold"
          >
            <span className="text-left font-normal">Menu</span>
            {isOpen ? (
              <ChevronUp className="ml-1 size-4 transition-all duration-300 ease-out" />
            ) : (
              <ChevronDown className="ml-1 size-4 transition-all duration-300 ease-out" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[999] md:-mr-24" align="end">
          <div className="flex flex-row space-y-1">
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
          <Link href="/" className="w-full" onClick={handleLinkClick}>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </Link>
          <Link
            href="/user/create"
            className="w-full"
            onClick={handleLinkClick}
          >
            <Button variant="ghost" className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Clips
            </Button>
          </Link>
          <Link
            href="/user/created"
            className="w-full"
            onClick={handleLinkClick}
          >
            <Button variant="ghost" className="w-full justify-start">
              <Film className="mr-2 h-4 w-4" />
              Created Clips
            </Button>
          </Link>
          <Link
            href="/user/settings"
            className="w-full"
            onClick={handleLinkClick}
          >
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
    <Link href="/" passHref>
      <Button
        className="w-full rounded-full px-6 text-sm font-semibold"
        variant="ringHover"
      >
        Get Started
        <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
      </Button>
    </Link>
  );
};

export default AuthButton;
