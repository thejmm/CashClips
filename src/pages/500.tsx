import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

const ServerError = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <motion.h1
          className="text-9xl font-bold mb-8"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          500
        </motion.h1>
        <motion.div
          className="text-2xl mb-8"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Oops! Server error occurred
        </motion.div>
        <motion.div
          className="mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link href="/">
            <Button variant="secondary" size="lg">
              Go back home
            </Button>
          </Link>
        </motion.div>
        {isVisible && (
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
        )}
      </div>
    </div>
  );
};

export default ServerError;
