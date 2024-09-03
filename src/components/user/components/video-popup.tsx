import React, { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

interface VideoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoViewer: React.FC<VideoViewerProps> = ({
  isOpen,
  onClose,
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const handleContainerClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 touch-none"
    >
      <div
        className={`relative w-full h-full ${
          isFullscreen ? "" : "max-w-full max-h-[100vh] p-4"
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors duration-200 z-10"
          aria-label="Close video"
        >
          <X size={24} />
        </button>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={videoUrl}
          controls
          autoPlay
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoViewer;
