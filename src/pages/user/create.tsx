// src/pages/user/create.tsx

import Create from "@/components/user/create";
import DashboardLayout from "@/components/layout/sidebar";
import { GetServerSidePropsContext } from "next";
import { PlusCircle } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface CreatePageProps {
  user: User;
}

export default function CreatePage({ user }: CreatePageProps) {
  return (
    <DashboardLayout
      checkSubscription={true}
      user={user}
      title="Create Clips"
      icon={<PlusCircle className="w-6 h-6" />}
    >
      <Create user={user} />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
