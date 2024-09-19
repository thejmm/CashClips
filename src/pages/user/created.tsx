// src/pages/user/created.tsx

import { CardStackIcon } from "@radix-ui/react-icons";
import Created from "@/components/user/created";
import DashboardLayout from "@/components/layout/sidebar";
import { Film } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface CreatedPageProps {
  user: User;
}

export default function CreatedPage({ user }: CreatedPageProps) {
  return (
    <DashboardLayout
      checkSubscription={true}
      user={user}
      title="Created Clips"
      icon={<Film className="w-6 h-6" />}
    >
      <Created />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
