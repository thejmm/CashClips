// pages/api/tools/metatags-fetch.ts

import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "Invalid URL provided" });
  }

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "MetaTagFetcher/1.0",
      },
    });

    const html = response.data;

    const metadata: MetaData = {
      title: extractContent(html, /<title>(.*?)<\/title>/i),
      description: extractMetaContent(html, "description"),
      keywords: extractMetaContent(html, "keywords"),
      author: extractMetaContent(html, "author"),
      ogTitle: extractMetaContent(html, "og:title", "property"),
      ogDescription: extractMetaContent(html, "og:description", "property"),
      ogImage: extractMetaContent(html, "og:image", "property"),
      twitterCard: extractMetaContent(html, "twitter:card"),
      twitterTitle: extractMetaContent(html, "twitter:title"),
      twitterDescription: extractMetaContent(html, "twitter:description"),
      twitterImage: extractMetaContent(html, "twitter:image"),
    };

    return res.status(200).json(metadata);
  } catch (error) {
    console.error("Error fetching metadata:", error);
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return res.status(error.response.status).json({
          error: `Failed to fetch metadata: ${error.response.statusText}`,
        });
      } else if (error.request) {
        return res
          .status(500)
          .json({ error: "No response received from the server" });
      }
    }
    return res
      .status(500)
      .json({ error: "An unexpected error occurred while fetching metadata" });
  }
}

function extractContent(html: string, regex: RegExp): string {
  const match = html.match(regex);
  return match && match[1] ? match[1].trim() : "";
}

function extractMetaContent(
  html: string,
  name: string,
  attributeName: string = "name",
): string {
  const regex = new RegExp(
    `<meta\\s+${attributeName}=["']${name}["']\\s+content=["'](.*?)["']`,
    "i",
  );
  return extractContent(html, regex);
}
