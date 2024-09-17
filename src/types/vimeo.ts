type VimeoSize = {
  width: number;
  height: number;
  link: string;
  link_with_play_button: string;
};

type VimeoPictures = {
  uri: string;
  active: boolean;
  type: string;
  base_link: string;
  sizes: VimeoSize[];
  resource_key: string;
  default_picture: boolean;
};

type VimeoVideo = {
  uri: string;
  name: string;
  description: null | string;
  pictures: {
    sizes: Array<{
      width: number;
      height: number;
      link: string;
    }>;
  };
  duration: number;
};

type VimeoAPIResponse = {
  [folderId: string]: VimeoVideo[];
};

type VimeoFolder = [VimeoVideo];
