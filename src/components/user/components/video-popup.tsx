import React, { useEffect, useRef } from "react";

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

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      onClick={handleContainerClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
    >
      <div
        className="relative w-full h-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-7 right-3 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors duration-200 z-10"
          aria-label="Close video"
        >
          <X size={24} />
        </button>
        <video
          ref={videoRef}
          className="p-2 w-full h-full object-contain"
          src={videoUrl}
          controls
          autoPlay
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoViewer;
