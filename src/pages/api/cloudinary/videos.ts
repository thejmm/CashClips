// src/pages/api/cloudinary/videos.ts
import type { NextApiRequest, NextApiResponse } from "next";

import { v2 as cloudinary } from "cloudinary";

// Set up Cloudinary credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { folderId } = req.query;

  if (!folderId || typeof folderId !== "string") {
    return res.status(400).json({ error: "Folder ID is required" });
  }

  try {
    // Fetch all videos within the folder from Cloudinary
    const videos = await cloudinary.search
      .expression(`folder:${folderId} AND resource_type:video`)
      .sort_by("created_at", "desc")
      .max_results(20)
      .execute();

    // Format Cloudinary's raw video data to the desired structure
    const formattedVideos = videos.resources.map((video: any) => ({
      id: video.asset_id,
      public_id: video.public_id,
      folder: video.folder,
      url: video.url,
      secure_url: video.url,
      thumbnail_url: video.url,
      duration: video.duration,
      format: video.format,
      width: video.width,
      height: video.height,
      created_at: video.created_at,
    }));

    res.status(200).json({ videos: formattedVideos });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
