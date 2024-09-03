// pages/api/proxy-video/[id].ts
import { NextApiRequest, NextApiResponse } from "next";

import fetch from "node-fetch";

export const config = {
  api: {
    bodyParser: false,
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Range",
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { id } = req.query;
  const url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch video");

    // Set content type and length headers
    res.setHeader(
      "Content-Type",
      response.headers.get("content-type") || "video/mp4",
    );
    res.setHeader(
      "Content-Length",
      response.headers.get("content-length") || "",
    );

    // Set Accept-Ranges header to support partial content requests
    res.setHeader("Accept-Ranges", "bytes");

    // Handle range requests
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const contentLength = parseInt(
        response.headers.get("content-length") || "0",
        10,
      );
      const end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;
      const chunksize = end - start + 1;

      res.setHeader("Content-Range", `bytes ${start}-${end}/${contentLength}`);
      res.setHeader("Content-Length", chunksize);
      res.status(206); // Partial Content

      const videoStream = response.body;
      videoStream.pipe(res);
    } else {
      // If no range is requested, stream the entire video
      response.body.pipe(res);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({ error: "Error proxying video" });
  }
}
