// pages/api/vimeo/videos.ts

import type { NextApiRequest, NextApiResponse } from "next";

const VIMEO_ACCESS_TOKEN = process.env.VIMEO_ACCESS_TOKEN;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!VIMEO_ACCESS_TOKEN) {
    return res.status(500).json({ error: "VIMEO_ACCESS_TOKEN is not set" });
  }

  const { folderId } = req.query;

  try {
    const userId = "150330981";
    const response = await fetch(
      `https://api.vimeo.com/users/${userId}/projects/${folderId}/videos`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${VIMEO_ACCESS_TOKEN}`,
          Accept: "application/vnd.vimeo.*+json;version=3.4",
        },
      },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch videos" });
    }

    const data = await response.json();
    const videos = data.data.map((video: any) => ({
      id: video.uri.split("/").pop(),
      name: video.name,
      duration: video.duration,
      pictures: video.pictures,
    }));

    res.status(200).json({ videos });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
