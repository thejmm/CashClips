// src/components/user/create/streamer.tsx
import React, { useEffect } from "react";

import { motion } from "framer-motion";

interface StreamerProps {
  selectedStreamer: string | null;
  handleStreamerSelect: (streamer: string) => void;
}

const Streamer: React.FC<StreamerProps> = ({
  selectedStreamer,
  handleStreamerSelect,
}) => {
  // NAMES ARE THE STREAMER NAMES THAT SHOULD SHOW
  // FOLDER NAMES ARE THE FIREBASE FOLDER NAMES
  // IMAGES ARE THE URLS TO THE STREAMER IMAGES
  const streamers = [
    { name: "Jack Doherty", folder: "Jack-Doherty", image: "/streamers/jack-doherty.png" },
    { name: "iShowSpeed", folder: "iShowSpeed", image: "/streamers/ishowspeed.png" },
    { name: "Kai Cenat", folder: "Kai-Cenat", image: "/streamers/kai-cenat.png" },
    { name: "xQc", folder: "xQc", image: "/streamers/xqc.png" },
    { name: "Adin Ross", folder: "Adin-Ross", image: "/streamers/adin-ross.png" },
  ];

  useEffect(() => {
    console.log(
      "Streamer component mounted. Selected streamer:",
      selectedStreamer,
    );
  }, [selectedStreamer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {streamers.map((streamer) => (
        <motion.div
          key={streamer.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`cursor-pointer rounded border p-4 transition-colors duration-200 ${
            selectedStreamer === streamer.name
              ? "border-2 border-primary"
              : "hover:border-primary"
          }`}
          onClick={() => {
            console.log("Streamer clicked:", streamer.name);
            handleStreamerSelect(streamer.name);
          }}
        >
          <div className="mx-auto mb-2 h-36 w-full justify-center overflow-hidden rounded md:h-56">
            <img
              src={streamer.image}
              alt={streamer.name}
              className="mx-auto h-full w-auto justify-center object-fill object-center"
            />
          </div>
          <p className="text-center font-medium">{streamer.name}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Streamer;
