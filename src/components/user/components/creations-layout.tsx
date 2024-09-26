// src/components/user/components/creations-layout.tsx
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Download,
  FileVideo,
  HardDrive,
  Loader,
  PlusCircle,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useCallback, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/ui/faceted-filter";
import Link from "next/link";
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

const VideoCard: React.FC<{ clip: Clip; userSpecific: boolean }> = ({
  clip,
  userSpecific,
}) => {
  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);

  const formatFileSize = (bytes: number | null | undefined) => {
    if (bytes == null) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) return "0 Bytes";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return (
      (Math.round((bytes / Math.pow(1024, i)) * 100) / 100).toFixed(2) +
      " " +
      sizes[i]
    );
  };

  const formatNumber = (
    value: number | null | undefined,
    decimals: number = 2,
  ) => {
    return value != null ? value.toFixed(decimals) : "N/A";
  };

  const renderStatus = () => {
    switch (clip.status) {
      case "succeeded":
        return (
          <span className="flex items-center text-green-500">
            <CheckCircle className="mr-1 h-4 w-4" /> Succeeded
          </span>
        );
      case "planned":
      case "waiting":
      case "transcribing":
      case "rendering":
        return (
          <span className="flex items-center text-yellow-500">
            <Loader className="mr-1 h-4 w-4 animate-spin" />
            {clip.status.charAt(0).toUpperCase() + clip.status.slice(1)}
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center text-red-500">
            <AlertCircle className="mr-1 h-4 w-4" /> Failed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Card className="flex h-full flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-2">
          <CardTitle className="truncate text-sm font-semibold">
            Clip {clip.render_id.slice(0, 8)}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-2">
          {userSpecific && (
            <>
              <div className="mb-2">{renderStatus()}</div>
              {clip.response && (
                <div className="space-y-1 text-xs">
                  <p className="flex items-center">
                    <FileVideo className="mr-1 h-3 w-3" />
                    {clip.response.width ?? "N/A"}x
                    {clip.response.height ?? "N/A"} @{" "}
                    {formatNumber(clip.response.frame_rate)}FPS
                  </p>
                  <p className="flex items-center">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatNumber(clip.response.duration)}s
                    <HardDrive className="ml-2 mr-1 h-3 w-3" />
                    {formatFileSize(clip.response.file_size)}
                  </p>
                </div>
              )}
            </>
          )}
          {clip.response?.url && (
            <div className="mt-2 aspect-square overflow-hidden rounded">
              <video
                className="mx-auto h-full w-full cursor-pointer object-cover"
                src={clip.response.url}
                onClick={() => setIsVideoViewerOpen(true)}
              />
            </div>
          )}
        </CardContent>
        {userSpecific && (
          <CardFooter className="pt-2">
            <p className="text-xs text-gray-500">
              Created: {new Date(clip.created_at).toLocaleString()}
            </p>
          </CardFooter>
        )}
      </Card>

      <VideoViewer
        isOpen={isVideoViewerOpen}
        onClose={() => setIsVideoViewerOpen(false)}
        videoUrl={clip.response?.url}
      />
    </>
  );
};

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
      {/* Showing item range and total */}
      <div className="flex w-full flex-col items-center justify-start space-y-2 text-center text-sm text-muted-foreground md:w-auto md:flex-row md:space-x-4 md:space-y-0">
        <span>
          Showing{" "}
          <strong>
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}
          </strong>{" "}
          to <strong>{Math.min(currentPage * pageSize, totalItems)}</strong> of{" "}
          <strong>{totalItems}</strong> items
        </span>

        {/* Rows per page */}
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[80px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">First page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <span className="sr-only">Last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const Creations: React.FC<CreationsProps> = ({
  userSpecific = false,
  title,
}) => {
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("created_at");
  const [filterStatus, setFilterStatus] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const supabase = createClient();

  const fetchClips = useCallback(async () => {
    try {
      setIsLoading(true);

      let query = supabase
        .from("created_clips")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      if (userSpecific) {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw new Error(userError.message);
        if (!user) throw new Error("User not authenticated");
        query = query.eq("user_id", user.id);
      }

      if (filterStatus.length > 0) {
        query = query.in("status", filterStatus);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      setClips(data ?? []);
      setTotalItems(count ?? 0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, userSpecific, filterStatus, supabase]);

  useEffect(() => {
    fetchClips();
  }, [fetchClips]);

  const handleFilterChange = (selectedValues: string[]) => {
    setFilterStatus(selectedValues);
    setCurrentPage(1);
  };

  const handleSortChange = (selectedValues: string[]) => {
    setSortBy(selectedValues[0] as SortOption);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Card className="mx-auto w-full space-y-8">
      <CardHeader className="space-y-3">
        <CardTitle>Clip History</CardTitle>
        <CardDescription>
          View your clipping activity over a selected time period
        </CardDescription>
        {userSpecific && (
          <div className="mb-6 flex flex-col gap-4 md:flex-row">
            <DataTableFacetedFilter
              title="Filter by Status"
              options={[
                { value: "succeeded", label: "Succeeded" },
                { value: "planned", label: "Processing" },
                { value: "waiting", label: "Waiting" },
                { value: "transcribing", label: "Transcribing" },
                { value: "rendering", label: "Rendering" },
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
        )}
      </CardHeader>

      <CardContent>
        <AnimatePresence>
          {clips.length === 0 ? (
            <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4">
              <p>No data available</p>
              <Link href="/user/create" passHref>
                <Button
                  variant="ringHover"
                  className="group w-full justify-start"
                >
                  <PlusCircle className="mr-2 size-4 transition-all duration-300 group-hover:-translate-x-1" />
                  Generate some clips
                </Button>
              </Link>
            </div>
          ) : (
            <LayoutGroup>
              <motion.div
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                layout
              >
                {clips.map((clip) => (
                  <motion.div
                    key={clip.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VideoCard clip={clip} userSpecific={userSpecific} />
                  </motion.div>
                ))}
              </motion.div>
            </LayoutGroup>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={totalItems}
        />
      </CardFooter>
    </Card>
  );
};

export default Creations;
