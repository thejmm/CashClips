// src/pages/api/cloudinary/streamers.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { v2 as cloudinary } from "cloudinary";

// Set up Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define the folder mapping
const folderMapping = {
  JackDoherty: {
    categories: {
      broll: "JackDoherty/broll",
      snap: "JackDoherty/snap",
      stream: "JackDoherty/stream",
      tiktok: "JackDoherty/tiktok",
    },
  },
  iShowSpeed: {
    categories: {
      broll: "iShowSpeed/broll",
      snap: "iShowSpeed/snap",
      stream: "iShowSpeed/stream",
      tiktok: "iShowSpeed/tiktok",
    },
  },
} as const;

type Streamer = keyof typeof folderMapping;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { streamer } = req.query;

  // Ensure streamer is a valid key in folderMapping
  if (
    !streamer ||
    typeof streamer !== "string" ||
    !(streamer in folderMapping)
  ) {
    return res.status(400).json({ error: "Invalid streamer selected" });
  }

  const selectedStreamer = folderMapping[streamer as Streamer];
  res.status(200).json({ categories: selectedStreamer.categories });
}
