// src/components/user/create/streamer.tsx
import { ChevronLeft, ChevronRight, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Add your Input component here
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

export interface Streamer {
  name: string;
  folder: string;
  image: string;
}

export interface StreamerProps {
  selectedStreamer: string | null;
  handleStreamerSelect: (streamer: Streamer) => void;
  handleCustomUpload: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}

const Streamer: React.FC<StreamerProps> = ({
  selectedStreamer,
  handleStreamerSelect,
  handleCustomUpload,
  isUploading,
  uploadProgress,
}) => {
  const streamers = [
    {
      name: "Jack Doherty",
      folder: "Jack-Doherty",
      image: "/streamers/jack-doherty.png",
    },
    {
      name: "iShowSpeed",
      folder: "iShowSpeed",
      image: "/streamers/ishowspeed.png",
    },
    {
      name: "Kai Cenat",
      folder: "Kai-Cenat",
      image: "/streamers/kai-cenat.png",
    },
    { name: "xQc", folder: "xQc", image: "/streamers/xqc.png" },
    {
      name: "Adin Ross",
      folder: "Adin-Ross",
      image: "/streamers/adin-ross.png",
    },
    {
      name: "Agent00",
      folder: "Agent00",
      image: "/streamers/agent00.png",
    },
    {
      name: "Amouranth",
      folder: "Amouranth",
      image: "/streamers/amouranth.png",
    },
    {
      name: "Jynxzi",
      folder: "Jynxzi",
      image: "/streamers/jynxzi.png",
    },
    {
      name: "Lacy",
      folder: "Lacy",
      image: "/streamers/lacy.png",
    },
    {
      name: "Nadia",
      folder: "Nadia",
      image: "/streamers/nadia.png",
    },
    {
      name: "Pokimane",
      folder: "Pokimane",
      image: "/streamers/pokimane.png",
    },
    {
      name: "shroud",
      folder: "shroud",
      image: "/streamers/shroud.png",
    },
    {
      name: "stableronaldo",
      folder: "stableronaldo",
      image: "/streamers/stableronaldo.png",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const totalPages = Math.ceil(streamers.length / pageSize);
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const isMd = useMediaQuery({ query: "(min-width: 640px)" });

  useEffect(() => {
    if (isLg) {
      setPageSize(8);
    } else if (isMd) {
      setPageSize(6);
    } else {
      setPageSize(4);
    }
  }, [isLg, isMd]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCustomUpload(file);
    }
  };

  // Filter streamers based on the search term
  const filteredStreamers = streamers.filter((streamer) =>
    streamer.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const paginatedStreamers = filteredStreamers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(
      Math.max(
        1,
        Math.min(newPage, Math.ceil(filteredStreamers.length / pageSize)),
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search streamers..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* Streamer grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {/* {currentPage === 1 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer rounded border border-dashed border-primary p-4 transition-colors duration-200 hover:bg-primary/10"
          >
            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="w-full">
                  <p className="mb-2 text-center">
                    Uploading: {uploadProgress.toFixed(2)}%
                  </p>
                  <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="mb-2 h-12 w-12 text-primary" />
                  <p className="text-center font-medium">Upload Your Own</p>
                </>
              )}
            </label>
          </motion.div>
        )} */}

        {paginatedStreamers.length > 0 ? (
          paginatedStreamers.map((streamer) => (
            <motion.div
              key={streamer.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded border p-4 transition-colors duration-200 ${
                selectedStreamer === streamer.folder
                  ? "border-2 border-primary"
                  : "hover:border-primary"
              }`}
              onClick={() => handleStreamerSelect(streamer)}
            >
              <div className="mx-auto mb-2 h-40 w-full justify-center overflow-hidden rounded">
                <img
                  src={streamer.image}
                  alt={streamer.name}
                  className="mx-auto h-full w-auto justify-center object-fill object-center"
                />
              </div>
              <p className="text-center font-medium">{streamer.name}</p>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center">No streamers found.</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
        <div className="text-sm text-gray-500">
          {filteredStreamers.length > 0 ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredStreamers.length)} of{" "}
              {filteredStreamers.length} streamers
            </>
          ) : (
            "No streamers available"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(filteredStreamers.length / pageSize)
            }
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Streamer;
