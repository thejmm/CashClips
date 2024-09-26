// src/pages/api/firebase/streamers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { listAll, ref } from "firebase/storage";

import { storage } from "@/utils/firebase/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { streamer } = req.query;

  try {
    const streamersRef = ref(storage, "");
    const streamersResult = await listAll(streamersRef);

    // If no specific streamer is requested, return all streamers
    if (!streamer) {
      const streamers = streamersResult.prefixes.map((prefix) => prefix.name);
      return res.status(200).json({ streamers });
    }

    // If a specific streamer is requested, ensure it exists
    if (
      typeof streamer !== "string" ||
      !streamersResult.prefixes.some((prefix) => prefix.name === streamer)
    ) {
      return res.status(400).json({ error: "Invalid streamer selected" });
    }

    const streamerRef = ref(storage, streamer);
    const streamerResult = await listAll(streamerRef);

    const categories = streamerResult.prefixes.reduce(
      (acc, prefix) => {
        acc[prefix.name] = `${streamer}/${prefix.name}`;
        return acc;
      },
      {} as Record<string, string>,
    );

    res.status(200).json({
      streamer,
      categories,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
