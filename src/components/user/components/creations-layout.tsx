import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  FileVideo,
  HardDrive,
  Loader,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/faceted-filter";
import VideoViewer from "./video-popup";
import { createClient } from "@/utils/supabase/component";

interface Clip {
  id: number;
  render_id: string;
  status:
    | "planned"
    | "waiting"
    | "transcribing"
    | "rendering"
    | "succeeded"
    | "failed";
  response: {
    id: string;
    url: string;
    width: number;
    height: number;
    duration: number;
    file_size: number;
    frame_rate: number;
    output_format: string;
  };
  created_at: string;
}

type SortOption = "created_at" | "duration" | "file_size";

interface CreationsProps {
  userSpecific?: boolean;
  title: string;
}

const VideoCard: React.FC<{ clip: Clip }> = ({ clip }) => {
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch the file.");
      const blob = await response.blob();

      if (navigator.share) {
        const fileName = url.split("/").pop() || "video.mp4";
        const file = new File([blob], fileName, { type: blob.type });

        await navigator.share({
          files: [file],
          title: "Download Video",
          text: "Here is your video file.",
        });
      } else {
        // Fallback for non-iOS devices
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = url.split("/").pop() || "download";
        document.body.appendChild(anchor);
        anchor.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(anchor);
      }
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const renderStatus = () => {
    switch (clip.status) {
      case "succeeded":
        return (
          <span className="text-green-500 flex items-center">
            <CheckCircle className="mr-1 h-4 w-4" /> Succeeded
          </span>
        );
      case "planned":
      case "waiting":
      case "transcribing":
      case "rendering":
        return (
          <span className="text-yellow-500 flex items-center">
            <Loader className="mr-1 h-4 w-4 animate-spin" />
            {clip.status.charAt(0).toUpperCase() + clip.status.slice(1)}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader className="flex flex-row justify-between p-2 items-center">
          <CardTitle className="text-sm font-semibold truncate">
            Clip {clip.render_id.slice(0, 8)}
          </CardTitle>
          {clip.status === "succeeded" && clip.response?.url && (
            <Button size="sm" onClick={() => handleDownload(clip.response.url)}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-2">
          <div className="mb-2">{renderStatus()}</div>
          {clip.response && (
            <div className="space-y-1 text-xs">
              <p className="flex items-center">
                <FileVideo className="mr-1 h-3 w-3" />
                {clip.response.width}x{clip.response.height} @{" "}
                {clip.response.frame_rate}FPS
              </p>
              <p className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {clip.response.duration}s
                <HardDrive className="ml-2 mr-1 h-3 w-3" />
                {formatFileSize(clip.response.file_size)}
              </p>
              {clip.response.url && (
                <div className="mt-2 aspect-square overflow-hidden rounded">
                  <video
                    className="w-full h-full mx-auto object-cover cursor-pointer"
                    src={clip.response.url}
                    onClick={() => setIsVideoViewerOpen(true)}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <p className="text-xs text-gray-500">
            Created: {new Date(clip.created_at).toLocaleString()}
          </p>
        </CardFooter>
      </Card>

      <VideoViewer
        isOpen={isVideoViewerOpen}
        onClose={() => setIsVideoViewerOpen(false)}
        videoUrl={clip.response.url}
      />
    </>
  );
};

const Creations: React.FC<CreationsProps> = ({
  userSpecific = false,
  title,
}) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [filteredClips, setFilteredClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const supabase = createClient();

  useEffect(() => {
    fetchClips();
  }, []);

  useEffect(() => {
    const sorted = [...clips].sort((a, b) => {
      if (sortBy === "created_at")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "duration")
        return b.response.duration - a.response.duration;
      if (sortBy === "file_size")
        return b.response.file_size - a.response.file_size;
      return 0;
    });

    const filtered = sorted.filter(
      (clip) =>
        clip.status !== "failed" && // Exclude failed clips
        (filterStatus.length === 0 || filterStatus.includes(clip.status)) &&
        clip.render_id.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredClips(filtered);
  }, [clips, sortBy, filterStatus, searchTerm]);

  const fetchClips = async () => {
    try {
      setIsLoading(true);

      let data: Clip[] | null = null;
      let error: any = null;

      if (userSpecific) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw new Error(userError.message);
        if (!user) throw new Error("User not authenticated");

        const result = await supabase
          .from("created_clips")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        data = result.data;
        error = result.error;
      } else {
        const result = await supabase
          .from("created_clips")
          .select("*")
          .order("created_at", { ascending: false });

        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      setClips(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (selectedValues: string[]) => {
    setFilterStatus(selectedValues);
  };

  const handleSortChange = (selectedValues: string[]) => {
    setSortBy(selectedValues[0] as SortOption);
  };

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader className="h-12 w-12 animate-spin" />
        <p className="text-xl font-bold ml-4">Fetching Creations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[23rem] sm:max-w-5xl md:max-w-7xl mx-auto space-y-8 p-2 md:p-4">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <DataTableFacetedFilter
          title="Filter by Status"
          options={[
            { value: "succeeded", label: "Succeeded" },
            { value: "planned", label: "Processing" },
            { value: "waiting", label: "Waiting" },
            { value: "transcribing", label: "Transcribing" },
            { value: "rendering", label: "Rendering" },
            // Removed the "failed" option
          ]}
          selectedValues={filterStatus}
          onChange={handleFilterChange}
        />

        <DataTableFacetedFilter
          title="Sort By"
          options={[
            { value: "created_at", label: "Date Created" },
            { value: "duration", label: "Duration" },
            { value: "file_size", label: "File Size" },
          ]}
          selectedValues={[sortBy]}
          onChange={handleSortChange}
        />
      </div>

      <AnimatePresence>
        {filteredClips.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500"
          >
            No clips found matching your criteria.
          </motion.p>
        ) : (
          <LayoutGroup>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              layout
            >
              {filteredClips.map((clip) => (
                <motion.div
                  key={clip.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VideoCard clip={clip} />
                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Creations;
