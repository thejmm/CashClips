// src/components/landing/user/dash/password-change.tsx
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/component";
import { toast } from "sonner";

interface PasswordSectionProps {
  user: any;
}

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDataChanged, setIsPasswordDataChanged] = useState(false);

  const supabase = createClient();

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
    if (!user) return;

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

  const handlePasswordInputChange =
    (setValue: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setIsPasswordDataChanged(true);
    };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Change your password to protect your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                New Password
              </label>
              <Input
                type="password"
                value={newPassword}
                onChange={handlePasswordInputChange(setNewPassword)}
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
                onChange={handlePasswordInputChange(setConfirmPassword)}
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
    </>
  );
};

export default PasswordSection;
