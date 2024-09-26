import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { User } from "@supabase/supabase-js";
import { pricingConfig } from "@/components/landing/pricing";

interface UserData {
  plan_name: string | null;
  plan_price: number | null;
  used_credits: number | null;
  total_credits: number | null;
  subscription_status: string | null;
  next_billing_date: string | null;
}

interface PlanCreditUsageProps {
  userData: UserData | null | undefined;
  user: User;
}

const PlanCreditUsage: React.FC<PlanCreditUsageProps> = ({
  userData,
  user,
}) => {
  const [loading, setLoading] = useState(false);

  const usagePercentage =
    userData && userData.total_credits && userData.total_credits > 0
      ? ((userData.used_credits || 0) / userData.total_credits) * 100
      : 0;

  const currentPlan = pricingConfig.plans.find(
    (plan) => plan.name === userData?.plan_name,
  );

  const getStatusColor = (status: string | null | undefined) => {
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

  const handleManageSubscription = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error creating portal session", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>
            {userData?.plan_name || "No Active Plan"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-2 text-2xl font-bold sm:text-3xl">
            ${userData?.plan_price ? (userData.plan_price / 100).toFixed(2) : 0}
            /month
          </div>
          <div
            className={`mb-4 text-sm ${getStatusColor(
              userData?.subscription_status,
            )}`}
          >
            Status: {userData?.subscription_status || "Inactive"}
          </div>
          <div className="mb-4 text-sm">
            {/* Check for a valid next billing date */}
            Next billing date:{" "}
            {userData?.next_billing_date
              ? new Date(userData.next_billing_date).toLocaleDateString()
              : "N/A"}
          </div>
          {/* Only show the portal button if the subscription is active */}
          {userData?.subscription_status === "active" && (
            <Button
              variant="ringHover"
              className="w-full"
              onClick={handleManageSubscription}
              disabled={loading}
            >
              {loading ? "Loading..." : "Manage Subscription"}
            </Button>
          )}

          {/* If no active subscription, show the "Get Started" button */}
          {!userData?.subscription_status && (
            <Link href="/pricing" passHref>
              <Button variant="ringHover" className="w-full">
                Get Started
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credit Usage</CardTitle>
          <CardDescription>
            {userData?.total_credits !== null &&
            userData?.total_credits !== undefined
              ? `${userData.used_credits || 0} / ${
                  userData.total_credits
                } credits used`
              : "0 of 0 credits used"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={usagePercentage} className="mb-2 w-full" />
          <p className="mb-4 text-sm text-muted-foreground">
            {userData?.total_credits !== null &&
            userData?.total_credits !== undefined
              ? `${usagePercentage.toFixed(1)}% of your credits used`
              : "100% - No credits available"}
          </p>
          <div className="text-sm">
            <div className="mb-2 flex justify-between">
              <span>Clips per month:</span>
              <span>{currentPlan?.features[0] || "N/A"}</span>
            </div>
            <div className="mb-2 flex justify-between">
              <span>Export quality:</span>
              <span>{currentPlan?.features[1] || "N/A"}</span>
            </div>
            <div className="mb-2 flex justify-between">
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
  );
};

export default PlanCreditUsage;
