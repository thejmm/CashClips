// src/components/user/dash/plan-credit-usage.tsx

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { User } from "@supabase/supabase-js";
import { pricingConfig } from "@/components/landing/pricing";

interface PlanCreditUsageProps {
  userData: {
    plan_name: string;
    plan_price: number;
    used_credits: number;
    total_credits: number;
    subscription_status: string;
    next_billing_date: string;
  } | null;
  user: User;
}

const PlanCreditUsage: React.FC<PlanCreditUsageProps> = ({
  userData,
  user,
}) => {
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

  return (
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
            ${userData?.plan_price ? (userData.plan_price / 100).toFixed(2) : 0}
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
  );
};

export default PlanCreditUsage;
