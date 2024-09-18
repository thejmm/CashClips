import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// src/components/user/user-button.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronRight,
  Film,
  LayoutDashboardIcon,
  LogOut,
  PlusCircle,
  Settings,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";

// Import Sheet components

const AuthButton = ({ initialUser }: { initialUser: User | null }) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isOpen, setIsOpen] = useState(false); // Manage Sheet open state
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

  return (
    <>
      {user ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ringHover"
              className="w-full rounded-full px-6 text-sm font-semibold"
            >
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] p-4 pt-8 md:p-8">
            <div className="relative flex flex-col space-y-4 h-full">
              {/* User Avatar and Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="mr-2">
                  <AvatarImage
                    className="w-10 h-10 rounded-full border border-black dark:border-white"
                    src={
                      user.user_metadata.picture ||
                      user.user_metadata.avatar_url
                    }
                    alt={user.user_metadata.name || "User"}
                  />
                  <AvatarFallback className="w-10 h-10 rounded-full">
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.email || "User"}</p>
                  <p className="text-xs text-muted-foreground">Logged In</p>
                </div>
              </div>
              <Separator />
              {/* Navigation Links */}
              <Link href="/user/dashboard" onClick={handleLinkClick}>
                <Button
                  variant="outlineRingHover"
                  className="w-full group justify-start transition-all duration-300 ease-out group"
                >
                  <LayoutDashboardIcon className="mr-2 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/user/create" onClick={handleLinkClick}>
                <Button
                  variant="outlineRingHover"
                  className="w-full group justify-start transition-all duration-300 ease-out group"
                >
                  <PlusCircle className="mr-2 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                  Create Clips
                </Button>
              </Link>
              <Link href="/user/created" onClick={handleLinkClick}>
                <Button
                  variant="outlineRingHover"
                  className="w-full group justify-start transition-all duration-300 ease-out group"
                >
                  <Film className="mr-2 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                  Created Clips
                </Button>
              </Link>
              <Link href="/user/settings" onClick={handleLinkClick}>
                <Button
                  variant="outlineRingHover"
                  className="w-full group justify-start transition-all duration-300 ease-out group"
                >
                  <Settings className="mr-2 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                  Settings
                </Button>
              </Link>
              {/* Logout Button */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructiveRingHover"
                    className="absolute bottom-0 w-full justify-start transition-all duration-300 ease-out group"
                  >
                    <LogOut className="mr-2 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                    Log out
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to log out?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will sign you out of your account. You will
                      need to log in again to access your account features.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                      <Button
                        variant="outlineRingHover"
                        className="transition-all duration-300 group "
                      >
                        <X className="mr-1 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                        Cancel
                      </Button>
                    </AlertDialogCancel>
                    <Button
                      variant="destructiveRingHover"
                      onClick={handleSignOut}
                      className="transition-all duration-300 group"
                    >
                      <LogOut className="mr-1 size-4 transition-all duration-300 ease-out group-hover:-translate-x-1" />
                      Log out
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Link href="/login" passHref>
          <Button
            className="w-full rounded-full px-6 text-sm font-semibold"
            variant="ringHover"
          >
            Get Started
            <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
          </Button>
        </Link>
      )}
    </>
  );
};

export default AuthButton;
