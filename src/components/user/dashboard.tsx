// src/components/user/dashboard.tsx
import {
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  ZapIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CashClipsDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();

  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("user_data")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      setUserData(data as UserData);
    } catch (error) {
      console.error("Error fetching user data:", error);
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
    (plan) => plan.name === userData?.plan_name,
  );

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

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <RefreshCw className="animate-spin h-8 w-8" />
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
                  userData?.subscription_status || "",
                )}`}
              >
                Status: {userData?.subscription_status || "Inactive"}
              </div>
              <div className="text-sm mb-4">
                Next billing date: {userData?.next_billing_date || "N/A"}
              </div>
              <Link href="/pricing" passHref>
                <Button variant="ringHover" className="w-full">
                  {userData?.plan_name ? "Upgrade Plan" : "Get Started"}
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
                <div className="flex justify-between">
                  <span>Auto-captioning:</span>
                  <span>{currentPlan?.features[2] || "N/A"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Clip History</CardTitle>
              <CardDescription>
                Your clipping activity over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.clip_history && userData.clip_history.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userData.clip_history}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="clips" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No clip history available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Trend</CardTitle>
              <CardDescription>Your credit usage over time</CardDescription>
            </CardHeader>
            <CardContent>
              {userData?.usage_trend && userData.usage_trend.length > 0 ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userData.usage_trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="usage" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No usage trend data available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Distribution</CardTitle>
              <CardDescription>Breakdown of your credit usage</CardDescription>
            </CardHeader>
            <CardContent>
              {userData ? (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Used", value: userData.used_credits },
                          {
                            name: "Remaining",
                            value:
                              userData.total_credits - userData.used_credits,
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: "Used", value: userData.used_credits },
                          {
                            name: "Remaining",
                            value:
                              userData.total_credits - userData.used_credits,
                          },
                        ].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  No credit data available
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {userData?.recent_activity &&
              userData.recent_activity.length > 0 ? (
                <ul className="space-y-4">
                  {userData.recent_activity.map((activity, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="flex items-center">
                        {activity.type === "clip" && (
                          <ZapIcon className="mr-2 h-4 w-4 text-blue-500" />
                        )}
                        {activity.type === "subscription" && (
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        )}
                        {activity.type === "other" && (
                          <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                        )}
                        {activity.description}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {activity.date}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No recent activity
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
