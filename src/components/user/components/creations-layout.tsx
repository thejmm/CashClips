// src/components/user/components/creations-layout.tsx

import {
  AlertCircle,
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
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/faceted-filter";
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
  userSpecific?: boolean; // If true, fetches user-specific creations; otherwise, fetches all creations
  title: string; // Title to display at the top of the page
}

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
        // Fetch user-specific creations
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
        // Fetch all creations
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

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch the file.");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = url.split("/").pop() || "download";
      document.body.appendChild(anchor);
      anchor.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(anchor);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + " " + sizes[i];
  };

  const handleFilterChange = (selectedValues: string[]) => {
    setFilterStatus(selectedValues);
  };

  const handleSortChange = (selectedValues: string[]) => {
    setSortBy(selectedValues[0] as SortOption);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const renderClipCard = (clip: Clip) => (
    <motion.div
      key={clip.id}
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold truncate">
            Clip {clip.render_id.slice(0, 8)}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-500 mb-2">
            Created: {new Date(clip.created_at).toLocaleString()}
          </p>
          <p
            className={`text-sm font-medium mb-2 ${
              clip.status === "succeeded"
                ? "text-green-500"
                : clip.status === "failed"
                  ? "text-red-500"
                  : "text-yellow-500"
            }`}
          >
            Status: {clip.status.charAt(0).toUpperCase() + clip.status.slice(1)}
          </p>
          {clip.response && (
            <div className="space-y-1">
              <p className="text-sm flex items-center">
                <FileVideo className="mr-2 h-4 w-4" />
                {clip.response.width}x{clip.response.height}{" "}
                {clip.response.output_format.toUpperCase()}
              </p>
              <p className="text-sm flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {clip.response.duration}s @ {clip.response.frame_rate}fps
              </p>
              <p className="text-sm flex items-center">
                <HardDrive className="mr-2 h-4 w-4" />
                {formatFileSize(clip.response.file_size)}
              </p>
              {clip.response.url && (
                <div className="mt-2">
                  <video
                    width="100%"
                    height="auto"
                    controls
                    src={clip.response.url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          {clip.status === "succeeded" && clip.response?.url && (
            <Button
              onClick={() => handleDownload(clip.response.url)}
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          )}
          {["planned", "waiting", "transcribing", "rendering"].includes(
            clip.status,
          ) && (
            <Button disabled className="w-full">
              <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
              {clip.status.charAt(0).toUpperCase() + clip.status.slice(1)}
            </Button>
          )}
          {clip.status === "failed" && (
            <Button variant="destructive" className="w-full" disabled>
              <AlertCircle className="mr-2 h-4 w-4" /> Failed
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );

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
    <div className="w-full max-w-[23rem] sm:max-w-5xl md:max-w-7xl mx-auto space-y-8 p-4">
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
            { value: "failed", label: "Failed" },
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
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              layout
            >
              {filteredClips.map(renderClipCard)}
            </motion.div>
          </LayoutGroup>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Creations;
