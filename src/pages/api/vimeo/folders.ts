// src/pages/api/vimeo/folders.ts

import { NextApiRequest, NextApiResponse } from "next";

import { Vimeo } from "@vimeo/vimeo";

const client = new Vimeo(
  process.env.VIMEO_CLIENT_ID as string,
  process.env.VIMEO_CLIENT_SECRET as string,
  process.env.VIMEO_ACCESS_TOKEN as string,
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const folders = [
    "22018591", // Kick Clips
    "22018601", // Snap Clips
    "22018599", // B-Roll Clips
    "22018597", // TikTok Clips
  ];

  try {
    const videosByFolder = await fetchVideosFromFolders(folders);
    res.status(200).json(videosByFolder);
  } catch (error) {
    console.error("Error fetching videos from folders:", error);
    res.status(500).json({ error: "Failed to fetch videos from folders" });
  }
}

async function fetchVideosFromFolders(
  folders: string[],
): Promise<Record<string, any[]>> {
  const videosByFolder: Record<string, any[]> = {};

  for (const folderId of folders) {
    try {
      const videos = await fetchAllVideosFromFolder(folderId);
      videosByFolder[folderId] = videos;
    } catch (error) {
      console.error(`Error fetching videos for folder ${folderId}:`, error);
      videosByFolder[folderId] = [];
    }
  }

  return videosByFolder;
}

async function fetchAllVideosFromFolder(folderId: string): Promise<any[]> {
  const allVideos: any[] = [];
  let page = 1;
  const perPage = 100; // Max items per page as per Vimeo API

  while (true) {
    try {
      const videos = await fetchVideosFromFolder(folderId, page, perPage);
      allVideos.push(...videos);

      // Break the loop if there are no more videos to fetch
      if (videos.length < perPage) break;

      // Move to the next page
      page++;
    } catch (error) {
      console.error(
        `Error fetching page ${page} of folder ${folderId}:`,
        error,
      );
      break; // Exit the loop if there's an error
    }
  }

  return allVideos;
}

async function fetchVideosFromFolder(
  folderId: string,
  page: number,
  perPage: number,
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    client.request(
      {
        method: "GET",
        path: `/me/projects/${folderId}/videos`,
        query: {
          fields: "uri,name,description,pictures,duration,download",
          per_page: perPage,
          page: page,
        },
      },
      (error, body) => {
        if (error) {
          reject(error);
        } else {
          const formattedVideos = body.data.map((video: any) => ({
            uri: video.uri,
            name: video.name,
            description: video.description,
            pictures: video.pictures,
            download: video.download,
            duration: video.duration,
          }));
          resolve(formattedVideos);
        }
      },
    );
  });
}
