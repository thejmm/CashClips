// src/pages/user/create.tsx

import DashboardLayout from "@/components/layout/sidebar";
import Create from "@/components/user/create";
import { getUserServerSideProps } from "@/utils/supabase/auth";
import { User } from "@supabase/supabase-js";
import { PlusCircle } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { NextSeo } from "next-seo";

interface CreatePageProps {
  user: User;
}

export default function CreatePage({ user }: CreatePageProps) {
  return (
    <>
      <NextSeo
        title="Create Clips - CashClips"
        description="Create and customize engaging video clips for social sharing with CashClips. Start making clips today!"
        canonical="https://cashclips.io/user/create"
        openGraph={{
          url: "https://cashclips.io/user/create",
          title: "Create Clips - CashClips",
          description:
            "Easily create and customize engaging video clips for sharing across all major social platforms.",
          images: [
            {
              url: "https://cashclips.io/seo.png",
              width: 1200,
              height: 630,
              alt: "Create Clips on CashClips",
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
        checkSubscription={true}
        user={user}
        title="Create Clips"
        icon={<PlusCircle className="h-6 w-6" />}
      >
        <Create user={user} />
      </DashboardLayout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return getUserServerSideProps(context);
}
