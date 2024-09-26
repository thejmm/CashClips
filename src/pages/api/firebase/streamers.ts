// src/pages/api/firebase/streamers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { listAll, ref } from "firebase/storage";

import { storage } from "@/utils/firebase/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const streamersRef = ref(storage, "");
    const streamersResult = await listAll(streamersRef);

    const streamers = streamersResult.prefixes.map((prefix) => prefix.name);
    return res.status(200).json({ streamers });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}