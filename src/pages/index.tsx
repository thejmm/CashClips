import Dashboard from "@/components/user/sections/dashboard";
// src/pages/dashboard/index.tsx
import { GetServerSidePropsContext } from "next";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server-props";

interface DashboardPageProps {
  user: User;
}

export default function DashboardPage({ user }: DashboardPageProps) {
  return <Dashboard user={user} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
