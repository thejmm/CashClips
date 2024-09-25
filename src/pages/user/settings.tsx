// src/pages/settings.tsx
import DashboardLayout from "@/components/layout/sidebar";
import { GetServerSidePropsContext } from "next";
import { Settings } from "lucide-react";
import SettingsContent from "@/components/user/settings";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface SettingsPageProps {
  user: User;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  return (
    <DashboardLayout
      user={user}
      title="Settings"
      icon={<Settings className="w-6 h-6" />}
    >
      <SettingsContent user={user} />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
