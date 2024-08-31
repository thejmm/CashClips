// src/pages/editor.tsx

import Editor from "@/components/user/sections/editor";
import { GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/server-props";

export default function DashboardPage() {
  return <Editor />;
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
