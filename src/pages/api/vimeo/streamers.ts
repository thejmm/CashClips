// pages/api/vimeo/streamers.ts

import type { NextApiRequest, NextApiResponse } from "next";

const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

const folderMapping = {
  "Jack Doherty": {
    id: "22221222",
    categories: {
      "B-Roll Clips": "22018599",
      "Snap Clips": "22018601",
      "Stream Clips": "22018591",
      "TikTok Clips": "22018597",
    },
  },
  iShowSpeed: {
    id: "22221229",
    categories: {
      "B-Roll Clips": "22221242",
      "Snap Clips": "22221245",
      "Stream Clips": "22221247",
      "TikTok Clips": "22221239",
    },
  },
} as const;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!VIMEO_ACCESS_TOKEN) {
    return res.status(500).json({ error: "VIMEO_ACCESS_TOKEN is not set" });
  }

  const { streamer } = req.query;

  try {
    if (
      !streamer ||
      typeof streamer !== "string" ||
      !(streamer in folderMapping)
    ) {
      return res.status(400).json({ error: "Invalid streamer selected" });
    }

    const selectedStreamer =
      folderMapping[streamer as keyof typeof folderMapping];
    res.status(200).json({ categories: selectedStreamer.categories });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
