// src/components/landing/user/dash/plan-info.tsx

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
import { Separator } from "@/components/ui/separator";
import { User } from "@supabase/supabase-js";
import { pricingConfig } from "@/components/landing/sections/pricing";

interface PlanInfoProps {
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

const PlanInfo: React.FC<PlanInfoProps> = ({ userData, user }) => {
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
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Subsciption</CardTitle>
          <CardDescription>Current plan information.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl sm:text-3xl font-bold mb-2">
            {userData?.plan_name || "None"}
          </div>
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
          <Separator className="mb-2" />

          <div className="text-sm mb-4">
            Next billing date: {userData?.next_billing_date || "N/A"}
          </div>
          <Link href="/pricing" passHref>
            <Button variant="ringHover">
              {userData?.plan_name ? "Change Plan" : "Get Started"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanInfo;
