// src/pages/index.tsx

import CashClipsDashboard from "@/components/user/dashboard";
import DashboardLayout from "@/components/layout/sidebar";
import { GetServerSidePropsContext } from "next";
import { LayoutDashboardIcon } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface HomePageProps {
  user: User;
}

export default function DashboardPage({ user }: HomePageProps) {
  return (
    <DashboardLayout
      user={user}
      title="Dashboard"
      icon={<LayoutDashboardIcon className="w-6 h-6" />}
    >
      <CashClipsDashboard user={user} />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
