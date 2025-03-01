// utils/supabase/auth.ts

import { GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/server-props";

export async function getUserServerSideProps(
  context: GetServerSidePropsContext,
) {
  const supabase = createClient(context);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  // Only return serializable user data
  return {
    props: {
      user,
    },
  };
}
