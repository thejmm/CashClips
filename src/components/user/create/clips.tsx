import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

import { Loader } from "lucide-react";
import { VimeoVideo } from "@/types/vimeo"; // Import correct VimeoVideo type
import { motion } from "framer-motion";

interface ClipsProps {
  selectedStreamer: string | null;
  selectedFolderId: string | null;
  handleFolderChange: (folderId: string) => void;
  handleVideoSelect: (video: VimeoVideo) => void;
  selectedVideo: VimeoVideo | null;
}

const Clips: React.FC<ClipsProps> = ({
  selectedStreamer,
  selectedFolderId,
  handleFolderChange,
  handleVideoSelect,
  selectedVideo,
}) => {
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [videos, setVideos] = useState<VimeoVideo[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Fetch folders (categories) when a streamer is selected
  useEffect(() => {
    if (selectedStreamer) {
      setLoadingFolders(true);
      fetch(`/api/vimeo/streamers?streamer=${selectedStreamer}`)
        .then((res) => res.json())
        .then((data) =>
          setFolders(
            Object.keys(data.categories).map((key) => ({
              id: data.categories[key],
              name: key,
            }))
          )
        )
        .finally(() => setLoadingFolders(false));
    }
  }, [selectedStreamer]);

  // Fetch videos when a folder is selected
  const handleSelectFolder = (folderId: string) => {
    handleFolderChange(folderId);
    setLoadingVideos(true);
    fetch(`/api/vimeo/videos?folderId=${folderId}`)
      .then((res) => res.json())
      .then((data) => setVideos(data.videos))
      .finally(() => setLoadingVideos(false));
  };

  // Get the best quality thumbnail
  const getBetterQualityThumbnail = (sizes: any[]) => {
    return sizes.reduce(
      (best, current) => (current.width > best.width ? current : best),
      sizes[0]
    );
  };

  // Format duration (e.g., 2:15)
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div className="space-y-4">
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
                  key={video.uri}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`border p-2 rounded cursor-pointer transition-colors duration-200 ${
                    selectedVideo?.uri === video.uri
                      ? "border-blue-500 border-2"
                      : "hover:border-blue-500"
                  }`}
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="relative w-full h-40 mb-2 overflow-hidden rounded">
                    {video.pictures.sizes.length > 0 ? (
                      <img
                        src={
                          getBetterQualityThumbnail(video.pictures.sizes).link
                        }
                        alt={video.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500">No thumbnail</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white px-2 py-1 text-sm rounded-tl">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  <p className="text-center font-medium truncate">
                    {video.name}
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
