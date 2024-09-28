// seo.config.ts

import { DefaultSeoProps } from "next-seo";

const defaultSEO: DefaultSeoProps = {
  title: "CashClips",

  description:
    "Transform your content into engaging, shareable clips across all major platforms. CashClips makes it easy to boost your online presence and grow your audience with optimized video content.",

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cashclips.io",
    site_name: "CashClips",

    images: [
      {
        url: "https://cashclips.io/seo.png",
        width: 1200,
        height: 630,
        alt: "CashClips - Create Shareable Content",
      },
    ],
    description:
      "Boost your online presence with CashClips. Create shareable, engaging clips easily and effectively.",
  },

  twitter: {
    handle: "@cashclipsio",
    site: "@cashclipsio",
    cardType: "summary_large_image",
  },

  additionalMetaTags: [
    {
      name: "viewport",
      content:
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
    },
    {
      httpEquiv: "x-ua-compatible",
      content: "IE=edge; chrome=1",
    },
    {
      name: "theme-color",
      content: "#00f545",
    },
    {
      name: "robots",
      content:
        "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    {
      name: "author",
      content: "CashClips",
    },
    {
      name: "keywords",
      content:
        "video clips, content creation, social media, shareable videos, clip generation",
    },
  ],

  additionalLinkTags: [
    {
      // The favicon of the website
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "preconnect",
      href: "https://fonts.googleapis.com",
    },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
      crossOrigin: "true",
    },
  ],
};

export default defaultSEO;
