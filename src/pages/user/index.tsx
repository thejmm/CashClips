// src/pages/index.tsx

import UserDashboard from "@/components/landing/user/dashboard";
import { GetServerSidePropsContext } from "next";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface HomePageProps {
  user: User;
}

export default function DashboardPage({ user }: HomePageProps) {
  return (
    <div className="max-w-7xl min-h-screen mx-auto flex flex-col md:flex-row">
      <UserDashboard user={user} />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
