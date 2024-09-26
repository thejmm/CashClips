// src/components/user/settings.tsx
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
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InvoiceTable from "./dash/invoice-table";
import { Loader } from "lucide-react";
import PlanCreditUsage from "./dash/plan-credit-usage";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { toast } from "sonner";
import { useRouter } from "next/router";

interface UserData {
  plan_name: string | null;
  plan_price: number | null;
  used_credits: number | null;
  total_credits: number | null;
  subscription_status: string | null;
  next_billing_date: string | null;
}

interface InvoiceData {
  id: string;
  amount_due: number;
  amount_paid: number;
  created: string;
  status: string;
  stripe_invoice_id: string;
  user_id: string;
  currency: string;
  amount_remaining: number;
  period_start: string;
  period_end: string;
  stripe_subscription_id?: string;
}

interface SubscriptionData {
  current_period_end: string;
  cancel_at_period_end: boolean;
}

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

interface SettingsContentProps {
  user: User;
}

const SettingsContent: React.FC<SettingsContentProps> = ({ user }) => {
  const router = useRouter();
  const supabase = createClient();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[] | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<SubscriptionData | null>(null);
  const [username, setUsername] = useState(user.user_metadata.username || "");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.user_metadata.avatar_url || null,
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDataChanged, setIsPasswordDataChanged] = useState(false);
  const [isProfileDataChanged, setIsProfileDataChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userDataResult, invoiceDataResult, subscriptionDataResult] =
          await Promise.all([
            supabase
              .from("user_data")
              .select("*")
              .eq("user_id", user.id)
              .single(),
            supabase.from("invoices").select("*").eq("user_id", user.id),
            supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id)
              .single(),
          ]);

        if (userDataResult.error) throw userDataResult.error;
        if (invoiceDataResult.error) throw invoiceDataResult.error;
        if (
          subscriptionDataResult.error &&
          subscriptionDataResult.error.code !== "PGRST116"
        )
          throw subscriptionDataResult.error;

        setUserData(userDataResult.data as UserData);
        setInvoiceData(invoiceDataResult.data as InvoiceData[]);
        setSubscriptionData(subscriptionDataResult.data as SubscriptionData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.id, supabase]);

  const validateInputs = (): boolean => {
    const newErrors: Errors = {};
    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }
    if (newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
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
        email: user.email || "",
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
        setIsPasswordDataChanged(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);

    try {
      const { data: updatedUser, error: profileError } =
        await supabase.auth.updateUser({
          data: {
            username: username || user.email,
          },
        });

      if (profileError) {
        toast.error(`Failed to update profile: ${profileError.message}`);
      } else {
        toast.success("Profile updated successfully");
        setIsProfileDataChanged(false);
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setIsProfileDataChanged(true);
  };

  const handlePasswordInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setIsPasswordDataChanged(true);
    };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin" />
        <p className="ml-4 text-xl font-bold">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[23rem] space-y-8 p-4 sm:max-w-5xl md:max-w-7xl">
      <header className="mb-8 flex flex-col items-center justify-between sm:flex-row">
        <div className="mb-4 text-center sm:mb-0 sm:text-left">
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
            Welcome back, {user?.user_metadata?.username || user.email}
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Manage your CashClips account and track your usage
          </p>
        </div>
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>
            {user.email?.[0].toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      </header>

      <PlanCreditUsage userData={userData} user={user} />

      <InvoiceTable invoiceData={invoiceData} />

      <Card>
        <CardHeader>
          <CardTitle>UserName Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Username</label>
            <Input
              value={username}
              onChange={handleProfileInputChange}
              placeholder="Enter your username"
            />
            <Button
              onClick={handleUpdateProfile}
              disabled={
                !isProfileDataChanged ||
                isLoading ||
                username === "" ||
                username === user.user_metadata.username
              }
              className="mt-4"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={handlePasswordInputChange(setNewPassword)}
                className={errors.newPassword ? "border-destructive" : ""}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-destructive">
                  {errors.newPassword}
                </p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={handlePasswordInputChange(setConfirmPassword)}
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-destructive">
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
              disabled={
                !isPasswordDataChanged ||
                isLoading ||
                !newPassword ||
                !confirmPassword
              }
            >
              Update Password
            </Button>
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
              onChange={handlePasswordInputChange(setCurrentPassword)}
              className={errors.currentPassword ? "border-destructive" : ""}
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-destructive">
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
