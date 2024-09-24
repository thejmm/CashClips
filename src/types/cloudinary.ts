// types/cloudinary.ts

export type CloudinaryFolder = {
  name: string; // Name of the folder
  path: string; // Path to the folder
  resource_count: number; // Number of resources in the folder
  created_at: string; // Timestamp of when the folder was created
};

export type CloudinaryVideo = {
  id: string; // Unique ID for the video
  public_id: string; // Public ID for the video in Cloudinary
  folder: string; // The folder where the video is stored
  format: string; // Video format (e.g., "mp4")
  url: string; // Direct URL to the video
  secure_url: string; // Secure URL to the video
  thumbnail_url: string; // URL for the video's thumbnail
  duration: number; // Duration of the video in seconds
  width: number; // Width of the video
  height: number; // Height of the video
  created_at: string; // Timestamp of when the video was created
};
