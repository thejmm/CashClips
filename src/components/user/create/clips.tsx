// src/components/user/create/clips.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Loader } from "lucide-react";
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
  width: number;
  height: number;
  created_at: string;
}

interface ClipsProps {
  selectedStreamer: string | null;
  selectedCategory: string | null;
  handleCategoryChange: (category: string) => void;
  handleVideoSelect: (video: FirebaseVideo) => void;
  selectedVideo: FirebaseVideo | null;
  setAvailableVideos: (videos: FirebaseVideo[]) => void;
}

const Clips: React.FC<ClipsProps> = ({
  selectedStreamer,
  selectedCategory,
  handleCategoryChange,
  handleVideoSelect,
  selectedVideo,
  setAvailableVideos,
}) => {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [videos, setVideos] = useState<FirebaseVideo[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Fetch categories and default videos from "streams" category
  useEffect(() => {
    if (selectedStreamer) {
      setLoadingCategories(true);
      fetch(`/api/firebase/streamers?streamer=${selectedStreamer}`)
        .then((res) => res.json())
        .then((data) => {
          const categoryData = Object.keys(data.categories).map((key) => ({
            id: data.categories[key],
            name: key,
          }));
          setCategories(categoryData);

          // If no category is selected, default to "streams"
          if (!selectedCategory) {
            handleCategoryChange("streams");
          }
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [selectedStreamer, selectedCategory, handleCategoryChange]);

  // Fetch videos when category changes or on default to "streams"
  useEffect(() => {
    if (selectedStreamer && selectedCategory) {
      setLoadingVideos(true);
      fetch(
        `/api/firebase/videos?streamer=${selectedStreamer}&category=${selectedCategory}`,
      )
        .then((res) => res.json())
        .then((data) => {
          setVideos(data.videos);
          setAvailableVideos(data.videos);
        })
        .finally(() => setLoadingVideos(false));
    }
  }, [selectedStreamer, selectedCategory, setAvailableVideos]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {loadingCategories ? (
        <div className="flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading categories...</span>
        </div>
      ) : (
        <Select
          defaultValue="streams" // Default to "streams"
          onValueChange={(value) => handleCategoryChange(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedCategory && (
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
                      src={video.url}
                      controls={false}
                      autoPlay={false}
                      loop={false}
                      muted
                      playsInline
                      style={{ pointerEvents: "none" }}
                    />
                    <span className="absolute bottom-1 left-1 text-white bg-black bg-opacity-50 text-xs px-1 rounded">
                      {video.duration.toFixed(2)}s
                    </span>
                  </div>
                  <p className="text-center font-medium truncate">{video.id}</p>
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
