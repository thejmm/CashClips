// src/components/user/create/clips.tsx
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CloudinaryVideo } from "@/types/cloudinary"; // Updated type
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

interface ClipsProps {
  selectedStreamer: string | null;
  selectedFolderId: string | null;
  handleFolderChange: (folderId: string) => void;
  handleVideoSelect: (video: CloudinaryVideo) => void; // Updated type
  selectedVideo: CloudinaryVideo | null;
  setAvailableVideos: (videos: CloudinaryVideo[]) => void; // Updated type
}

const Clips: React.FC<ClipsProps> = ({
  selectedStreamer,
  selectedFolderId,
  handleFolderChange,
  handleVideoSelect,
  selectedVideo,
  setAvailableVideos,
}) => {
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [videos, setVideos] = useState<CloudinaryVideo[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  useEffect(() => {
    if (selectedStreamer) {
      setLoadingFolders(true);
      fetch(`/api/cloudinary/streamers?streamer=${selectedStreamer}`)
        .then((res) => res.json())
        .then((data) => {
          const folderData = Object.keys(data.categories).map((key) => ({
            id: data.categories[key],
            name: key,
          }));
          setFolders(folderData);
        })
        .finally(() => setLoadingFolders(false));
    }
  }, [selectedStreamer]);

  const handleSelectFolder = (folderId: string) => {
    handleFolderChange(folderId);
    setLoadingVideos(true);
    fetch(`/api/cloudinary/videos?folderId=${folderId}`)
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos);
        setAvailableVideos(data.videos);
      })
      .finally(() => setLoadingVideos(false));
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {loadingFolders ? (
        <div className="flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading categories...</span>
        </div>
      ) : (
        <Select onValueChange={(value) => handleSelectFolder(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {folders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedFolderId && (
        <div className="mt-4">
          {loadingVideos ? (
            <div className="flex justify-center items-center">
              <Loader className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading videos...</span>
            </div>
          ) : videos.length === 0 ? (
            <p className="text-center">No videos found in this category.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {videos.map((video) => (
                <motion.div
                  key={video.public_id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`border p-2 rounded cursor-pointer transition-colors duration-200 ${
                    selectedVideo?.public_id === video.public_id
                      ? "border-blue-500 border-2"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                    <video
                      className="w-full h-full object-cover"
                      src={video.url} // Use the MP4 URL
                      controls={false} // Disable controls
                      autoPlay={false} // Prevent autoplay
                      loop={false} // Prevent looping
                      muted // Mute the video (no sound)
                      playsInline // Ensure it plays inline on mobile
                      style={{ pointerEvents: "none" }} // Disable interaction
                    />
                    <span className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 text-xs px-1 rounded">
                      {video.duration.toFixed(2)}s
                    </span>
                  </div>
                  <p className="text-center font-medium truncate">
                    {video.public_id}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Clips;
