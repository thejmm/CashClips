import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/component";

interface UserData {
  plan_name: string;
  plan_price: number;
  used_credits: number;
  total_credits: number;
  recent_activity: Array<{ description: string; date: string }>;
  clip_history: Array<{ date: string; clips: number }>;
}

const CashClipsDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
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
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user.id, supabase]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const usagePercentage =
    userData && userData.total_credits > 0
      ? (userData.used_credits / userData.total_credits) * 100
      : 100;

  return (
    <div className="container mx-auto max-w-7xl py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user.email}</h1>
            <p className="text-muted-foreground">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                {userData?.plan_name || "No Active Plan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-row justify-between">
              <div className="text-3xl font-bold mb-2">
                ${userData?.plan_price ?? 0}/month
              </div>
              <Button>
                {userData?.plan_name ? "Upgrade Plan" : "Get Started"}
              </Button>
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
              <Progress value={usagePercentage} className="w-full" />
              <p className="mt-2 text-sm text-muted-foreground">
                {userData
                  ? `${usagePercentage.toFixed(1)}% of your credits used`
                  : "100% - No credits available"}
              </p>
            </CardContent>
          </Card>
        </div>

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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {userData?.recent_activity &&
            userData.recent_activity.length > 0 ? (
              <ul className="space-y-4">
                {userData.recent_activity.map((activity, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{activity.description}</span>
                    <span className="text-muted-foreground">
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
  );
};

export default CashClipsDashboard;
