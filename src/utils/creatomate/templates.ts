import { DefaultSource } from "./template-types";
import { v4 as uuidv4 } from "uuid";

export type { DefaultSource } from "./template-types";

export const videoUrls = [
  "https://cdn-crayo.com//crayo-admin/test-video/53895fa8-6c75-4145-81ba-e4da46fae222-minecraft-2.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/9f7e5c34-07b6-4377-b8fb-151aea4974f2-gta-3.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/da2ce303-f791-45e8-a75f-3a40f2b395fe-gta-5.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/661b331f-324d-41ef-9f80-8c56355552da-minecraft-3.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/e7dafcbd-4dab-44fb-90cb-804ee2a3b23e-subway-5.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/22b4457a-92e7-4127-8b84-838c726cc2a0-subway-1.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/28dbc455-c396-42b5-9d12-91b52a4d35cd-minecraft-9.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/7b74c048-0fa7-4c54-b67c-a97c9e55f260-mobile-2.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/74ffcb9d-2f0f-4047-96e3-9465ffd70066-minecraft-5.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/80d7f731-a39d-49fe-9b2a-5b826d38d6f5-minecraft-8.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/c42a4288-80ac-480f-ad6b-27b21591808d-gta-2.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/c84bd6d4-d0fe-4672-bb18-c6540d024964-subway-2.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/b6b5739c-cd20-4e3c-bd33-36283a9fb4b1-minecraft-1.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/5e086b8e-3a44-4f44-a10a-eef754cf1aa5-gta-4.mp4",
  "https://cdn-crayo.com//crayo-admin/test-video/af27162a-a2db-4423-8c39-70589526f8ed-gta-7.mp4",
];

const getRandomVideoUrl = () => {
  return videoUrls[Math.floor(Math.random() * videoUrls.length)];
};

const getRandomVideos = (count: number) => {
  return Array(count)
    .fill(null)
    .map(() => getRandomVideoUrl());
};

export const defaultSources: DefaultSource[] = [
  {
    name: "Portrait Split Screen",
    coverImage: "/templates/split-screen-portrait.png",
    layout: "portrait",
    type: "split",
    data: {
      output_format: "mp4",
      width: 1080,
      height: 1920,
      elements: getRandomVideos(2).map((url, index) => ({
        id: uuidv4(),
        duration: 10,
        source: url,
        type: "video",
        y: index === 0 ? "25%" : "75%",
        height: "50%",
      })),
    },
  },
  {
    name: "Landscape Split Screen",
    coverImage: "/templates/split-screen-landscape.png",
    layout: "landscape",
    type: "split",
    data: {
      output_format: "mp4",
      width: 1920,
      height: 1080,
      elements: getRandomVideos(2).map((url, index) => ({
        id: uuidv4(),
        duration: 10,
        source: url,
        type: "video",
        x: index === 0 ? "75%" : "25%",
        height: "100%",
        width: "50%",
      })),
    },
  },
  {
    name: "Portrait Blur Sides",
    coverImage: "/templates/blur-portrait.png",
    layout: "portrait",
    type: "blur",
    data: {
      output_format: "mp4",
      width: 1080,
      height: 1920,
      fill_color: "#262626",
      elements: (() => {
        const url = getRandomVideoUrl();
        return [
          {
            id: uuidv4(),
            duration: 10,
            source: url,
            type: "video",
            volume: "0%",
            color_overlay: "rgba(0,0,0,0.15)",
            blur_radius: 57,
            clip: true,
          },
          {
            id: uuidv4(),
            duration: 10,
            source: url,
            type: "video",
            fit: "contain",
          },
        ];
      })(),
    },
  },
  {
    name: "Landscape Blur Sides",
    coverImage: "/templates/blur-landscape.png",
    layout: "landscape",
    type: "blur",
    data: {
      output_format: "mp4",
      width: 1920,
      height: 1080,
      fill_color: "#262626",
      elements: (() => {
        const url = getRandomVideoUrl();
        return [
          {
            id: uuidv4(),
            duration: 10,
            source: url,
            type: "video",
            volume: "0%",
            color_overlay: "rgba(0,0,0,0.15)",
            blur_radius: 57,
            clip: true,
          },
          {
            id: uuidv4(),
            duration: 10,
            source: url,
            type: "video",
            fit: "cover",
            width: "50%",
            height: "100%",
          },
        ];
      })(),
    },
  },
  {
    name: "Picture-in-Picture",
    coverImage: "/templates/picture-in-picture.png",
    layout: "landscape",
    type: "picture-in-picture",
    data: {
      output_format: "mp4",
      width: 1920,
      height: 1080,
      elements: getRandomVideos(2).map((url, index) => ({
        id: uuidv4(),
        duration: 10,
        source: url,
        type: "video",
        ...(index === 0
          ? { width: "100%", height: "100%" }
          : {
              width: "30%",
              height: "30%",
              x: "18%",
              y: "20%",
              border_radius: "10px",
              stroke_color: "#FFFFFF",
              stroke_width: "4px",
            }),
      })),
    },
  },
  {
    name: "Perfect Square",
    coverImage: "/templates/square.png",
    layout: "square",
    type: "custom",
    data: {
      output_format: "mp4",
      width: 1080,
      height: 1080,
      elements: [
        {
          id: uuidv4(),
          duration: 10,
          source: getRandomVideoUrl(),
          type: "video",
          width: "100%",
          height: "100%",
          fit: "cover",
        },
      ],
    },
  },
  {
    name: "Triple Vertical Split",
    coverImage: "/templates/triple-split-vertical.png",
    layout: "portrait",
    type: "custom",
    data: {
      output_format: "mp4",
      width: 1080,
      height: 1920,
      elements: getRandomVideos(3).map((url, index) => ({
        id: uuidv4(),
        duration: 10,
        source: url,
        type: "video",
        y: `${16.67 + index * 33.33}%`,
        height: "33.33%",
        width: "100%",
      })),
    },
  },
];
