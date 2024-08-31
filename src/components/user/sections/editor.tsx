// src/components/user/sections/Editor.tsx

import {
  Loader,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { observer } from "mobx-react-lite";
import { videoCreator } from "@/store/creatomate";

const Editor: React.FC = observer(() => {
  const [isPreviewInitialized, setIsPreviewInitialized] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewRef.current && !videoCreator.preview) {
      videoCreator.initializeVideoPlayer(previewRef.current).then(() => {
        setIsPreviewInitialized(true);
        console.log("Preview initialized");
      });
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!isPreviewInitialized || !videoCreator.preview) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="mx-auto h-12 w-12 animate-spin mb-4" />
          <p className="text-xl font-bold">Initializing editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow">
        <div ref={previewRef} className="w-full h-full" />
      </div>
      <div className="bg-gray-200 p-4">
        <div className="flex justify-between items-center">
          <span>
            {formatTime(videoCreator.currentPlaybackTime)} /{" "}
            {formatTime(videoCreator.duration)}
          </span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => videoCreator.skipBackward()}
            >
              <SkipBackIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                videoCreator.isPlaying
                  ? videoCreator.preview?.pause()
                  : videoCreator.preview?.play()
              }
            >
              {videoCreator.isPlaying ? (
                <PauseIcon className="w-6 h-6" />
              ) : (
                <PlayIcon className="w-6 h-6" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => videoCreator.skipForward()}
            >
              <SkipForwardIcon className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Editor;
