// src/pages/settings.tsx
import DashboardLayout from "@/components/layout/sidebar";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";
import { Settings } from "lucide-react";
import SettingsContent from "@/components/user/settings";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface SettingsPageProps {
  user: User;
}

export default function SettingsPage({ user }: SettingsPageProps) {
  return (
    <>
      <NextSeo
        title="Settings - CashClips"
        description="Manage your account settings and preferences on CashClips."
        canonical="https://cashclips.io/settings"
        openGraph={{
          url: "https://cashclips.io/settings",
          title: "Settings - CashClips",
          description:
            "Customize your account settings and preferences on CashClips.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Settings",
            },
          ],
        }}
        twitter={{
          handle: "@cashclipsio",
          site: "@cashclipsio",
          cardType: "summary_large_image",
        }}
      />
      <DashboardLayout
        user={user}
        title="Settings"
        icon={<Settings className="h-6 w-6" />}
      >
        <SettingsContent user={user} />
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
