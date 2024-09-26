import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FirebaseVideo {
  id: string;
  public_id: string;
  folder: string;
  url: string;
  secure_url: string;
  thumbnail_url: string;
  duration: number;
  format: string;
  created_at: string;
}

interface ClipsProps {
  selectedStreamer: string | null;
  handleVideoSelect: (video: FirebaseVideo) => void;
  selectedVideo: FirebaseVideo | null;
  setAvailableVideos: (videos: FirebaseVideo[]) => void;
}

const Clips: React.FC<ClipsProps> = ({
  selectedStreamer,
  handleVideoSelect,
  selectedVideo,
  setAvailableVideos,
}) => {
  const [allVideos, setAllVideos] = useState<FirebaseVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    if (!selectedStreamer) return;

    setLoadingVideos(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/firebase/videos?streamer=${selectedStreamer}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (!Array.isArray(data.videos)) {
        throw new Error("Invalid data format received from server");
      }

      setAllVideos(data.videos);
      setAvailableVideos(data.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setError(`Failed to fetch videos: ${(error as Error).message}`);
    } finally {
      setLoadingVideos(false);
    }
  }, [selectedStreamer, setAvailableVideos]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const totalPages = Math.max(1, Math.ceil(allVideos.length / pageSize));

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const paginatedVideos = allVideos.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Videos per page" />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50, 100].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-center text-red-500">{error}</p>}

      {loadingVideos ? (
        <div className="flex items-center justify-center">
          <Loader className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading videos...</span>
        </div>
      ) : paginatedVideos.length === 0 ? (
        <p className="text-center">No videos found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {paginatedVideos.map((video) => (
            <motion.div
              key={video.public_id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded border p-2 transition-colors duration-200 ${
                selectedVideo?.public_id === video.public_id
                  ? "border-2 border-primary"
                  : "hover:border-primary"
              }`}
              onClick={() => handleVideoSelect(video)}
            >
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded">
                <video
                  className="h-full w-full object-cover"
                  src={video.url}
                  controls={false}
                  autoPlay={false}
                  loop={false}
                  muted
                  playsInline
                  style={{ pointerEvents: "none" }}
                />
                <span className="absolute bottom-1 left-1 rounded bg-black bg-opacity-50 px-1 text-xs text-white">
                  {video.duration.toFixed(2)}s
                </span>
              </div>
              <p className="truncate text-center font-medium">{video.id}</p>
            </motion.div>
          ))}
        </div>
      )}

      <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
        <div className="text-sm text-gray-500">
          {allVideos.length > 0 ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, allVideos.length)} of {allVideos.length}{" "}
              videos
            </>
          ) : (
            "No videos available"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loadingVideos}
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loadingVideos}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Clips;