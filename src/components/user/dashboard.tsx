// src/components/user/dashboard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useCallback, useEffect, useState } from "react";

import ClipHistory from "./dash/clip-history";
import Creations from "./components/creations-layout";
import { Loader } from "lucide-react";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";

export interface ClipData {
  id: number;
  render_id: string;
  user_id: string;
  status: string;
  response: any;
  payload: any;
  created_at: string;
  updated_at: string;
}

interface UserSubscriptionData {
  plan_name: string;
  total_credits: number;
  used_credits: number;
  subscription_status: string;
  next_billing_date: string;
}

const CashClipsDashboard: React.FC<{ user: SupabaseAuthUser }> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clipData, setClipData] = useState<ClipData[] | null>(null);
  const [subscriptionData, setSubscriptionData] =
    useState<UserSubscriptionData | null>(null);
  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [clipResponse, subscriptionResponse] = await Promise.all([
        supabase.from("created_clips").select("*").eq("user_id", user.id),
        supabase.from("user_data").select("*").eq("user_id", user.id).single(),
      ]);

      if (clipResponse.error) throw clipResponse.error;
      if (subscriptionResponse.error) throw subscriptionResponse.error;

      setClipData(clipResponse.data as ClipData[]);
      setSubscriptionData(subscriptionResponse.data as UserSubscriptionData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user.id, supabase]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin" />
        <p className="ml-4 text-xl font-bold">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[22rem] space-y-8 md:w-full md:max-w-full">
        <header className="mb-8 flex flex-col items-center justify-between sm:flex-row">
          <div className="mb-4 text-center sm:mb-0 sm:text-left">
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl md:text-4xl">
              Welcome back, {user?.user_metadata?.username || user.email}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              You have created {subscriptionData?.used_credits || 0} of{" "}
              {subscriptionData?.total_credits || 0} clips this month
            </p>
          </div>
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback>
              {user.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </header>
        <Creations userSpecific={true} title="Created Clips" />
        <ClipHistory clipData={clipData} />
      </div>
    </div>
  );
};

export default CashClipsDashboard;
