// src/components/user/create/streamer.tsx
import React, { useEffect } from "react";

import { motion } from "framer-motion";

export interface Streamer {
  name: string;
  folder: string;
  image: string;
}

export interface StreamerProps {
  selectedStreamer: string | null;
  handleStreamerSelect: (streamer: Streamer) => void;
}

const Streamer: React.FC<StreamerProps> = ({
  selectedStreamer,
  handleStreamerSelect,
}) => {
  // STREAMER DATA: NAMES, FOLDER NAMES, AND IMAGE URLs
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
            selectedStreamer === streamer.folder // Compare using folder name
              ? "border-2 border-primary"
              : "hover:border-primary"
          }`}
          onClick={() => {
            console.log("Streamer clicked:", streamer.name);
            handleStreamerSelect(streamer); // Pass the entire streamer object
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
