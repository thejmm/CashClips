// pages/api/vimeo/folders.ts
import type { NextApiRequest, NextApiResponse } from "next";

const vimeoAccessToken = process.env.VIMEO_ACCESS_TOKEN as string;

interface Folder {
  id: string;
  name: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const response = await fetch(
      `https://api.vimeo.com/users/${userId}/projects`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${vimeoAccessToken}`,
        },
      },
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch folders from Vimeo" });
    }

    const data = await response.json();

    const folders: Folder[] = data.data.map((folder: any) => ({
      id: folder.uri.split("/").pop(),
      name: folder.name,
    }));

    res.status(200).json({ folders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ error: "Failed to fetch folders from Vimeo" });
  }
}
