// src/components/user/dashboard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useCallback, useEffect, useState } from "react";

import ClipHistory from "./dash/clip-history";
import InvoiceTable from "./dash/invoice-table";
import { Loader } from "lucide-react";
import PlanCreditUsage from "./dash/plan-credit-usage";
import { User as SupabaseAuthUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";

interface UserData {
  plan_name: string;
  plan_price: number;
  used_credits: number;
  total_credits: number;
  subscription_status: string;
  next_billing_date: string;
  recent_activity: Array<{
    description: string;
    date: string;
    type: "clip" | "subscription" | "other";
  }>;
  clip_history: Array<{ date: string; clips: number }>;
  usage_trend: Array<{ date: string; usage: number }>;
}

interface ClipData {
  id: number;
  render_id: string;
  user_id: string;
  status: string;
  response: any;
  payload: any;
  created_at: string;
  updated_at: string;
}

interface InvoiceData {
  id: string;
  stripe_invoice_id: string;
  user_id: string;
  subscription_id: string;
  status: string;
  currency: string;
  amount_due: number;
  amount_paid: number;
  amount_remaining: number;
  created: string;
  period_start: string;
  period_end: string;
}

interface SubscriptionData {
  id: string;
  user_id: string;
  status: string;
  price_id: string;
  quantity: number;
  cancel_at_period_end: boolean;
  created_at: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string;
  trial_start: string;
  trial_end: string;
}

const CashClipsDashboard: React.FC<{ user: SupabaseAuthUser }> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [clipData, setClipData] = useState<ClipData[] | null>(null);
  const [invoiceData, setInvoiceData] = useState<InvoiceData[] | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<
    SubscriptionData[] | null
  >(null);

  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetching created clips data based on the auth user id
      const { data: clipData, error: clipError } = await supabase
        .from("created_clips")
        .select("*")
        .eq("user_id", user.id);

      if (clipError) throw clipError;

      // Fetching invoice data
      const { data: invoiceData, error: invoiceError } = await supabase
        .from("invoices")
        .select("*")
        .eq("user_id", user.id);

      if (invoiceError) throw invoiceError;

      // Fetching subscription data
      const { data: subscriptionData, error: subscriptionError } =
        await supabase.from("subscriptions").select("*").eq("user_id", user.id);

      if (subscriptionError) throw subscriptionError;

      setClipData(clipData as ClipData[]);
      setInvoiceData(invoiceData as InvoiceData[]);
      setSubscriptionData(subscriptionData as SubscriptionData[]);
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
        <p className="text-xl font-bold ml-4">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-8 sm:px-6 lg:px-8">
      <div className="max-w-[22rem] md:max-w-full md:w-full mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {user.email}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
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

        {/* Plan and Credit Usage */}
        <PlanCreditUsage userData={userData} user={user} />

        {/* Clip History */}
        <ClipHistory clipData={clipData} />

        {/* Invoice Table */}
        <InvoiceTable invoiceData={invoiceData} />
      </div>
    </div>
  );
};

export default CashClipsDashboard;
