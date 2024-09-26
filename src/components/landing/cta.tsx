"use client";

import {
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaTwitch,
  FaYoutube,
} from "react-icons/fa";
import {
  RiInstagramFill,
  RiKickFill,
  RiSnapchatFill,
  RiTiktokFill,
  RiTwitchFill,
  RiYoutubeFill,
} from "react-icons/ri";
import {
  SiInstagram,
  SiKick,
  SiTiktok,
  SiTwitch,
  SiYoutube,
} from "react-icons/si";
import { motion, useAnimation, useInView } from "framer-motion";
import { useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Marquee from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const tiles = [
  {
    icon: <RiYoutubeFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-red-600 to-red-400 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <RiTwitchFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-purple-600 to-purple-400 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <RiTiktokFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-gray-800 to-black opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <RiKickFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-green-600 to-green-400 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <RiSnapchatFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <RiInstagramFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <SiYoutube className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-red-600 to-red-400 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <SiTwitch className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-purple-600 to-purple-400 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <SiTiktok className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-gray-800 to-black opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <SiKick className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-green-600 to-green-400 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <RiSnapchatFill className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-70 blur-[20px] filter"></div>
    ),
  },
  {
    icon: <SiInstagram className="size-full" />,
    bg: (
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 opacity-70 blur-[20px] filter"></div>
    ),
  },
];

const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

const Card = (card: { icon: JSX.Element; bg: JSX.Element }) => {
  const id = useId();
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        transition: { delay: Math.random() * 2, ease: "easeOut", duration: 1 },
      });
    }
  }, [controls, inView]);

  return (
    <motion.div
      key={id}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={controls}
      className={cn(
        "relative size-20 cursor-pointer overflow-hidden rounded-2xl border p-4",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      {card.icon}
      {card.bg}
    </motion.div>
  );
};

export function CallToAction() {
  const [randomTiles1, setRandomTiles1] = useState<typeof tiles>([]);
  const [randomTiles2, setRandomTiles2] = useState<typeof tiles>([]);
  const [randomTiles3, setRandomTiles3] = useState<typeof tiles>([]);
  const [randomTiles4, setRandomTiles4] = useState<typeof tiles>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRandomTiles1(shuffleArray([...tiles]));
      setRandomTiles2(shuffleArray([...tiles]));
      setRandomTiles3(shuffleArray([...tiles]));
      setRandomTiles4(shuffleArray([...tiles]));
    }
  }, []);

  return (
    <section id="cta">
      <div className="pb-14">
        <div className="flex w-full flex-col items-center justify-center p-4">
          <div className="relative flex w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-[2rem] border">
            <Marquee
              reverse
              className="-delay-[200ms] [--duration:20s]"
              repeat={4}
            >
              {randomTiles1.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={4}>
              {randomTiles2.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee
              reverse
              className="-delay-[200ms] [--duration:20s]"
              repeat={4}
            >
              {randomTiles3.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <Marquee reverse className="[--duration:30s]" repeat={4}>
              {randomTiles4.map((tile, idx) => (
                <Card key={idx} {...tile} />
              ))}
            </Marquee>
            <div className="absolute z-10">
              <div className="mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32">
                <img src="/logo.png" className="h-full w-full rounded-3xl" />
              </div>
              <div className="z-10 mt-4 flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold lg:text-4xl">CashClips</h1>
                <p className="mt-2">
                  Your one-stop solution for clipping content
                </p>
                <Link href="/login" passHref>
                  <Button
                    variant="outlineRingHover"
                    className="group mt-4 rounded-full transition-all duration-300"
                  >
                    Get Started Today
                    <ChevronRightIcon className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              <div className="absolute inset-0 -z-10 rounded-full bg-white opacity-40 blur-xl dark:bg-background" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-white to-70% dark:to-background" />
          </div>
        </div>
      </div>
    </section>
  );
}
