// src/components/landing/hero.tsx
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { Spotlight } from "../ui/spotlights";
import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1];

export function HeroSection() {
  return (
    <section id="hero" className="overflow-hidden py-12 pb-24">
      {/* Spotlight Effect */}
      <Spotlight
        className="absolute -top-10 left-10 md:-top-20 md:left-40"
        fill="white"
      />

      <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center gap-8">
          {/* Text Section TOP */}
          <motion.div
            className="mx-auto flex flex-col items-center justify-center space-y-6 text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.5,
                  ease,
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            <div className="mx-auto space-y-2 text-center">
              <motion.h1
                className="mx-auto mb-2 max-w-3xl text-balance text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl"
                initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
                animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  ease,
                  staggerChildren: 0.2,
                }}
              >
                {["Create", "Viral", "Clips", "In", "Minutes"].map(
                  (text, index) => (
                    <motion.span
                      key={index}
                      className="inline-block px-1 md:px-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.2,
                        ease,
                      }}
                    >
                      {text}
                    </motion.span>
                  ),
                )}
              </motion.h1>
            </div>
            <motion.p
              className="mx-auto max-w-[600px] text-lg text-muted-foreground md:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                ease,
              }}
            >
              Transform your content into engaging, shareable clips across all
              major platforms. CashClips makes it easy to boost your online
              presence and grow your audience.
            </motion.p>
            <Link href="/user/create" passHref>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease }}
              >
                <Button
                  variant="ringHover"
                  className="group mx-auto my-2 justify-center rounded-full"
                  size="lg"
                >
                  Start Cash Clipping
                  <ChevronRightIcon className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Video Section BOTTOM */}
          <motion.div
            className="m-auto flex items-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="m-auto flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <video
                  className="h-36 w-auto rounded-lg md:h-80"
                  autoPlay
                  muted
                  loop
                  controls={false}
                  playsInline
                >
                  <source src="/assets/share2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <video
                  className="h-52 w-auto rounded-lg md:h-96"
                  autoPlay
                  muted
                  loop
                  controls={false}
                  playsInline
                >
                  <source src="/assets/share1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <video
                  className="h-36 w-auto rounded-lg md:h-80"
                  autoPlay
                  muted
                  loop
                  controls={false}
                  playsInline
                >
                  <source src="/assets/share3.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
