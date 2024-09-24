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
  const streamers = [
    { name: "JackDoherty", image: "/streamers/jack-doherty.png" },
    { name: "iShowSpeed", image: "/streamers/ishowspeed.png" },
  ];

  useEffect(() => {
    console.log("Streamer component mounted. Selected streamer:", selectedStreamer);
  }, [selectedStreamer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {streamers.map((streamer) => (
        <motion.div
          key={streamer.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
            selectedStreamer === streamer.name
              ? "border-blue-500 border-2"
              : "hover:border-blue-500"
          }`}
          onClick={() => {
            console.log("Streamer clicked:", streamer.name);
            handleStreamerSelect(streamer.name);
          }}
        >
          <div className="w-full mx-auto justify-center h-36 md:h-56 mb-2 overflow-hidden rounded">
            <img
              src={streamer.image}
              alt={streamer.name}
              className="w-auto h-full mx-auto justify-center object-center object-fill"
            />
          </div>
          <p className="text-center font-medium">{streamer.name}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Streamer;