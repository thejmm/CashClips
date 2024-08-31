// src/pages/index.tsx

import DashboardLayout from "@/components/layout/sidebar";
import { GetServerSidePropsContext } from "next";
import { HomeIcon } from "lucide-react";
import HomePage from "@/components/user/sections/home";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface HomePageProps {
  user: User;
}

export default function DashboardPage({ user }: HomePageProps) {
  return (
    <DashboardLayout
      user={user}
      title="Home"
      icon={<HomeIcon className="w-6 h-6" />}
    >
      <HomePage />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
