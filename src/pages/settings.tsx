// src/pages/user/settings.tsx
import { GetServerSidePropsContext } from "next";
import SettingsContent from "@/components/user/settings";
import { createClient } from "@/utils/supabase/server-props";

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-4">
      <SettingsContent />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
