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

import { User as AuthUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/component";
import { toast } from "sonner";
import { useRouter } from "next/router";

interface Errors {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SettingsContent: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [username, setUsername] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPasswordDataChanged, setIsPasswordDataChanged] = useState(false);
  const [isProfileDataChanged, setIsProfileDataChanged] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Failed to fetch user data");
        router.push("/login");
        return;
      }

      setUser(user);
      setUsername(user.user_metadata.username || "");

      if (user.user_metadata.avatar_url) {
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(user.user_metadata.avatar_url);
        setAvatarUrl(data?.publicUrl || null);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [router, supabase]);

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
      // Re-authenticate the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email || "",
        password: currentPassword,
      });

      if (signInError) {
        toast.error("Current password is incorrect");
        setErrors({ currentPassword: "Current password is incorrect" });
        return;
      }

      // Update the password
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
    if (!user) return;
    setIsLoading(true);

    try {
      let uploadedAvatarUrl = user.user_metadata.avatar_url;

      if (avatarFile) {
        // Upload the avatar image
        const { data, error } = await supabase.storage
          .from("avatars")
          .upload(`public/${user.id}/${avatarFile.name}`, avatarFile, {
            upsert: true,
          });

        if (error) {
          toast.error("Error uploading avatar");
          return;
        }
        uploadedAvatarUrl = data?.path;

        const { data: publicData } = supabase.storage
          .from("avatars")
          .getPublicUrl(uploadedAvatarUrl);
        setAvatarUrl(publicData?.publicUrl || null);
      }

      // Update the user metadata
      const { data: updatedUser, error: profileError } =
        await supabase.auth.updateUser({
          data: {
            username: username || user.email,
            avatar_url: uploadedAvatarUrl,
          },
        });

      if (profileError) {
        toast.error(`Failed to update profile: ${profileError.message}`);
      } else {
        toast.success("Username updated successfully");
        setUser(updatedUser.user);
        setAvatarFile(null);
        setIsProfileDataChanged(false);
      }
    } catch (error) {
      toast.error("An error occurred while updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Input handlers for profile and password fields
  const handleProfileInputChange =
    (setValue: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setIsProfileDataChanged(true);
    };

  const handlePasswordInputChange =
    (setValue: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setIsPasswordDataChanged(true);
    };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin" />
        <p className="text-xl font-bold ml-4">Loading Settings...</p>
      </div>
    );
  }

  if (!user) {
    // User is not logged in; you can redirect or display a message
    router.push("/login");
    return null;
  }

  return (
    <div className="w-full max-w-[23rem] sm:max-w-5xl md:max-w-7xl mx-auto space-y-8 p-4">
      {/* Profile Update Section */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.[0].toUpperCase() ||
                    user.user_metadata?.username?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{username || user.email}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Separator />
          <div>
            <label className="block text-sm font-medium mb-2">Username</label>
            <Input
              value={username}
              onChange={handleProfileInputChange(setUsername)}
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

      {/* Password Update Section */}
      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
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

      {/* Password Confirmation Dialog */}
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
    </div>
  );
};

export default SettingsContent;
