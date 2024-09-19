// src/components/user/dashboard.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";
import { pricingConfig } from "../landing/pricing";

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

const CashClipsDashboard: React.FC<{ user: User }> = ({ user }) => {
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
      // Fetching user data
      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (userError) throw userError;

      // Fetching created clips data
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

      setUserData(userData as UserData);
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

  const usagePercentage =
    userData && userData.total_credits > 0
      ? (userData.used_credits / userData.total_credits) * 100
      : 100;

  const currentPlan = pricingConfig.plans.find(
    (plan) => plan.name === userData?.plan_name
  );

  const formatClipData = (data: ClipData[]) => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
      })
      .reverse();

    const countsByDate = data.reduce((acc, clip) => {
      const date = new Date(clip.created_at).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return last7Days.map((date) => ({
      date,
      clips: countsByDate[date] || 0,
    }));
  };

  const chartConfig = {
    clips: {
      label: "Clips Created",
      color: "hsl(var(--chart-1))",
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "past_due":
        return "text-yellow-500";
      case "canceled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin" />
        <p className="text-xl font-bold ml-4">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                {userData?.plan_name || "No Active Plan"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold mb-2">
                $
                {userData?.plan_price
                  ? (userData.plan_price / 100).toFixed(2)
                  : 0}
                /month
              </div>
              <div
                className={`text-sm mb-4 ${getStatusColor(
                  userData?.subscription_status || ""
                )}`}
              >
                Status: {userData?.subscription_status || "Inactive"}
              </div>
              <div className="text-sm mb-4">
                Next billing date: {userData?.next_billing_date || "N/A"}
              </div>
              <Link href="/pricing" passHref>
                <Button variant="ringHover" className="w-full">
                  {userData?.plan_name ? "Change Plan" : "Get Started"}
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credit Usage</CardTitle>
              <CardDescription>
                {userData
                  ? `${userData.used_credits} / ${userData.total_credits} credits used`
                  : "0 of 0 credits used"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={usagePercentage} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                {userData
                  ? `${usagePercentage.toFixed(1)}% of your credits used`
                  : "100% - No credits available"}
              </p>
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span>Clips per month:</span>
                  <span>{currentPlan?.features[0] || "N/A"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Export quality:</span>
                  <span>{currentPlan?.features[1] || "N/A"}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Video length:</span>
                  <span>{currentPlan?.features[2] || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Auto-captioning:</span>
                  <span>{currentPlan?.features[3] || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Clip History */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Clip History</CardTitle>
              <CardDescription>
                Your clipping activity over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={clipData ? formatClipData(clipData) : []}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Bar
                      dataKey="clips"
                      fill="var(--chart-1)"
                      radius={[4, 4, 0, 0]}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(label) =>
                            new Date(label).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          }
                        />
                      }
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Invoice Table */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>List of your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              {invoiceData && invoiceData.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableCell>Invoice ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Amount Due</TableCell>
                      <TableCell>Amount Paid</TableCell>
                      <TableCell>Currency</TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceData?.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.stripe_invoice_id}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>{invoice.amount_due}</TableCell>
                        <TableCell>{invoice.amount_paid}</TableCell>
                        <TableCell>{invoice.currency}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No invoices available currently
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CashClipsDashboard;
