// src/pages/api/firebase/videos.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getDownloadURL, getMetadata, listAll, ref } from "firebase/storage";

import { storage } from "@/utils/firebase/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { streamer, category } = req.query;

  if (
    !streamer ||
    typeof streamer !== "string" ||
    !category ||
    typeof category !== "string"
  ) {
    return res
      .status(400)
      .json({ error: "Streamer and category are required" });
  }

  try {
    const folderRef = ref(storage, `${streamer}/${category}`);
    const result = await listAll(folderRef);

    const videos = await Promise.all(
      result.items
        .filter((item) => item.name.endsWith(".mp4"))
        .map(async (item) => {
          const metadata = await getMetadata(item);
          const downloadURL = await getDownloadURL(item);

          return {
            id: item.name,
            public_id: item.fullPath,
            folder: `${streamer}/${category}`,
            url: downloadURL,
            secure_url: downloadURL,
            thumbnail_url: downloadURL,
            duration: metadata.size ? metadata.size / 1000000 : 0,
            format: "mp4",
            created_at: metadata.timeCreated,
          };
        })
    );

    res.status(200).json({ videos });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
