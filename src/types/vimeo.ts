// src/types/vimeo.ts
export type VimeoSize = {
  width: number;
  height: number;
  link: string;
  link_with_play_button: string;
};

export type VimeoPictures = {
  uri: string;
  active: boolean;
  type: string;
  base_link: string;
  sizes: VimeoSize[];
  resource_key: string;
  default_picture: boolean;
};

export type VimeoVideo = {
  uri: string;
  name: string;
  description: string | null; // Ensures that the description can be null.
  pictures: VimeoPictures;
  duration: number;
};

export type VimeoAPIResponse = {
  [folderId: string]: VimeoVideo[];
};

export type VimeoFolder = VimeoVideo[];
