// src/pages/api/auth/signout.ts

import type { NextApiRequest, NextApiResponse } from "next";

import createClient from "@/utils/supabase/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).appendHeader("Allow", "POST").end();
    return;
  }

  const supabase = createClient(req, res);
  await supabase.auth.signOut();

  res.status(200).json({ message: "Signed out successfully" });
}
