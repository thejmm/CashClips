// src/pages/index.tsx

import CashClipsDashboard from "@/components/user/dashboard";
import DashboardLayout from "@/components/layout/sidebar";
import { GetServerSidePropsContext } from "next";
import { LayoutDashboardIcon } from "lucide-react";
import { NextSeo } from "next-seo";
import { User } from "@supabase/supabase-js";
import { getUserServerSideProps } from "@/utils/supabase/auth";

interface HomePageProps {
  user: User;
}

export default function DashboardPage({ user }: HomePageProps) {
  return (
    <>
      <NextSeo
        title="Dashboard - CashClips"
        description="Manage your video clips and view your recent activity from your CashClips dashboard."
        canonical="https://cashclips.io/"
        openGraph={{
          url: "https://cashclips.io/",
          title: "Dashboard - CashClips",
          description:
            "Manage your video clips, view statistics, and access your recent activity from the CashClips dashboard.",
          images: [
            {
              url: "https://cashclips.io/seo.svg",
              width: 1200,
              height: 630,
              alt: "CashClips Dashboard",
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
        title="Dashboard"
        icon={<LayoutDashboardIcon className="h-6 w-6" />}
      >
        <CashClipsDashboard user={user} />
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
