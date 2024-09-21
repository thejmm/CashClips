// src/components/landing/user/dash/username-info.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";

import { User as AuthUser } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/component";
import { toast } from "sonner";
import { useRouter } from "next/router";

const UsernameInfo: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [username, setUsername] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
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

  const handleUpdateProfile = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      let uploadedAvatarUrl = user.user_metadata.avatar_url;

      if (avatarFile) {
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

  const handleProfileInputChange =
    (setValue: (value: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
      setIsProfileDataChanged(true);
    };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>View and update your profile.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center space-x-4">
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase() ||
                      user?.user_metadata?.username?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {username || user?.email}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Connected Accounts</h3>
              {user?.app_metadata?.providers &&
                user.app_metadata.providers.map((provider: string) => (
                  <div key={provider} className="space-y-4">
                    <div key={provider} className="flex items-center space-x-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>
                        {provider.charAt(0).toUpperCase() + provider.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
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
                username === user?.user_metadata.username
              }
              className="mt-4"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernameInfo;
