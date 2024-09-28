// src/pages/api/firebase/videos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDownloadURL, getMetadata, list, ref } from "firebase/storage";

import { storage } from "@/utils/firebase/firebase";

async function fetchAllItems(storageRef: any) {
  let allItems: any[] = [];
  let nextPageToken = null;

  do {
    const res = await list(storageRef, {
      maxResults: 1000,
      pageToken: nextPageToken,
    });
    allItems = allItems.concat(res.items);
    nextPageToken = res.nextPageToken;
  } while (nextPageToken);

  return allItems;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { streamer } = req.query;
  const userId = req.headers["user-id"] as string;

  if (!streamer || typeof streamer !== "string") {
    return res.status(400).json({ error: "Streamer is required" });
  }

  if (streamer === "user-uploads" && !userId) {
    return res
      .status(400)
      .json({ error: "User ID is required for user uploads" });
  }

  try {
    let storageRef;
    if (streamer === "user-uploads") {
      storageRef = ref(storage, `user-uploads/${userId}`);
    } else {
      storageRef = ref(storage, encodeURIComponent(streamer));
    }

    const allItems = await fetchAllItems(storageRef);
    const videos = await Promise.all(
      allItems
        .filter((item) => item.name.endsWith(".mp4"))
        .map(async (item) => {
          const metadata = await getMetadata(item);
          const downloadURL = await getDownloadURL(item);
          return {
            id: item.name,
            public_id: item.fullPath,
            folder: streamer,
            url: downloadURL,
            secure_url: downloadURL,
            thumbnail_url: downloadURL,
            size: metadata.size,
            format: "mp4",
            created_at: metadata.timeCreated,
          };
        }),
    );
    res.status(200).json({ videos });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
