// src/pages/api/firebase/videos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import {
  getDownloadURL,
  getMetadata,
  list,
  listAll,
  ref,
} from "firebase/storage";

import { storage } from "@/utils/firebase/firebase";

// Helper to paginate the results if necessary
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
  const { streamer } = req.query;

  if (!streamer || typeof streamer !== "string") {
    return res.status(400).json({ error: "Streamer is required" });
  }

  const encodedStreamer = encodeURIComponent(streamer);

  try {
    const streamerRef = ref(storage, encodedStreamer);
    const allItems = await fetchAllItems(streamerRef);

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
            duration: metadata.size ? metadata.size / 1000000 : 0,
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
