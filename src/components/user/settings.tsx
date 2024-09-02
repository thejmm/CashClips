// src/components/user/settings.tsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleCheck, User } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/component";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";

const supabase = createClient();

interface UserData {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  user_name: string;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  identities: {
    provider: string;
    identity_data: {
      email: string;
      avatar_url?: string;
    };
  }[];
}

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SettingsContent: React.FC = () => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        toast.error("Failed to fetch user data");
        router.push("/login");
        return;
      }
      setUserData(user as unknown as UserData);
    };
    fetchUserData();
  }, [router]);

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const validateInputs = (): boolean => {
    const newErrors: Errors = {};
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setErrors({ currentPassword: "Current password is incorrect" });
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        toast.error(`Failed to update password: ${updateError.message}`);
      } else {
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordDialogOpen(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const ThemePreview: React.FC<{ themeOption: "light" | "dark" }> = ({
    themeOption,
  }) => (
    <div
      className={`cursor-pointer p-4 border-2 rounded-md ${
        theme === themeOption ? "border-blue-500 border-4" : "border-gray-300"
      }`}
      onClick={() => handleThemeChange(themeOption)}
    >
      <div
        className={`items-center rounded-md border-2 border-muted p-1 hover:border-accent ${
          themeOption === "dark" ? "bg-slate-950" : "bg-[#ecedef]"
        }`}
      >
        {/* TOP SECTION / HEADER */}
        <div
          className={`flex items-center space-x-2 rounded-md ${
            themeOption === "dark" ? "bg-slate-800" : "bg-white"
          } p-2 shadow-sm`}
        >
          <div
            className={`h-4 w-4 rounded-full ${
              themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
            }`}
          />
          <div
            className={`h-2 w-4 rounded-lg ${
              themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
            }`}
          />
          <div
            className={`h-2 w-4 rounded-lg ${
              themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
            }`}
          />
          <div
            className={`h-2 w-4 rounded-lg ${
              themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
            }`}
          />
          <div
            className={`h-2 w-4 rounded-lg ${
              themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
            }`}
          />
          <div className={`h-2 w-20 rounded-lg`} />
          <div
            className={`h-6 w-16 rounded-md ${
              themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
            }`}
          />
        </div>

        <div
          className={`space-y-2 rounded-sm ${
            themeOption === "dark" ? "bg-slate-950" : "bg-[#ecedef]"
          } p-2`}
        >
          {/* 2ND SECTION */}
          <div
            className={`space-y-2 rounded-md ${
              themeOption === "dark" ? "bg-slate-800" : "bg-white"
            } p-2 shadow-sm`}
          >
            <div
              className={`h-2 w-[80px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
              }`}
            />
            <div
              className={`h-2 w-[100px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
              }`}
            />
            <div
              className={`h-3 w-[120px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-600" : "bg-gray-200"
              }`}
            />
            <div
              className={`h-4 w-[90px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-500" : "bg-gray-300"
              }`}
            />
          </div>

          {/* 3RD SECTION */}
          <div
            className={`space-y-2 rounded-md ${
              themeOption === "dark" ? "bg-slate-700" : "bg-gray-100"
            } p-2 shadow-sm`}
          >
            <div
              className={`h-3 w-[70px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-500" : "bg-gray-300"
              }`}
            />
            <div
              className={`h-2 w-[110px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-400" : "bg-[#ecedef]"
              }`}
            />
            <div
              className={`h-4 w-[85px] rounded-lg ${
                themeOption === "dark" ? "bg-slate-600" : "bg-gray-200"
              }`}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-center space-x-2">
        {theme === themeOption && (
          <CircleCheck className="h-5 w-5 text-green-500" />
        )}
        <span className="block text-center font-normal capitalize">
          {themeOption}
        </span>
      </div>
    </div>
  );

  const ConnectedAccount: React.FC<{
    provider: string;
    email: string;
    avatarUrl?: string;
  }> = ({ provider, email, avatarUrl }) => (
    <div className="flex items-center space-x-4 p-4 border rounded-md">
      <Avatar>
        <AvatarImage src={avatarUrl} />
        <AvatarFallback>{provider.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">
          {provider.charAt(0).toUpperCase() + provider.slice(1)}
        </p>
        <p className="text-sm text-muted-foreground">{email}</p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-[23rem] sm:max-w-5xl md:max-w-7xl mx-auto space-y-8 p-4">
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userData?.avatar_url} />
              <AvatarFallback>
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">
                {userData?.full_name || userData?.user_name}
              </h2>
              <p className="text-muted-foreground">{userData?.email}</p>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="font-medium mb-2">Connected Accounts</h3>
            <div className="space-y-2">
              {userData?.identities.map((identity) => (
                <ConnectedAccount
                  key={identity.provider}
                  provider={identity.provider}
                  email={identity.identity_data.email}
                  avatarUrl={identity.identity_data.avatar_url}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
            {["light", "dark"].map((themeOption) => (
              <ThemePreview
                key={themeOption}
                themeOption={themeOption as "light" | "dark"}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={errors.newPassword ? "border-destructive" : ""}
                />
                {errors.newPassword && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-destructive text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <Button
                onClick={() => {
                  if (
                    newPassword === confirmPassword &&
                    newPassword.length >= 8
                  ) {
                    setIsPasswordDialogOpen(true);
                  } else {
                    setErrors({
                      newPassword:
                        newPassword.length < 8
                          ? "Password must be at least 8 characters"
                          : "",
                      confirmPassword:
                        newPassword !== confirmPassword
                          ? "Passwords do not match"
                          : "",
                    });
                  }
                }}
              >
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter your current password to confirm this change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={errors.currentPassword ? "border-destructive" : ""}
            />
            {errors.currentPassword && (
              <p className="text-destructive text-sm mt-1">
                {errors.currentPassword}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsPasswordDialogOpen(false);
                setCurrentPassword("");
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUpdatePassword}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Confirm Change"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsContent;
