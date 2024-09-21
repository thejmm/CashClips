"use client";

import { ArrowRight, RocketIcon } from "lucide-react";

import AvatarCircles from "@/components/ui/avatar-circles";
import { Button } from "@/components/ui/button";
import HeroVideoDialog from "@/components/ui/hero-video-dialog";
import Link from "next/link";
import { Spotlight } from "@/components/ui/spotlights";
import { motion } from "framer-motion";
import { useRef } from "react";

const ease = [0.16, 1, 0.3, 1];

function HeroPill() {
  return (
    <motion.a
      href="/editor"
      className="flex w-auto items-center space-x-2 rounded-full bg-primary/20 px-2 py-1 ring-1 ring-accent whitespace-pre"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="flex items-center flex-row w-fit rounded-full bg-accent px-2 py-0.5 text-center text-xs font-medium text-primary sm:text-sm">
        <RocketIcon className="w-4 h-4" /> Start Building
      </div>
      <p className="text-xs font-medium text-primary sm:text-sm">
        No credit card required
      </p>
      <svg
        width="12"
        height="12"
        className="ml-1"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8.78141 5.33312L5.20541 1.75712L6.14808 0.814453L11.3334 5.99979L6.14808 11.1851L5.20541 10.2425L8.78141 6.66645H0.666748V5.33312H8.78141Z"
          fill="hsl(var(--primary))"
        />
      </svg>
    </motion.a>
  );
}

function HeroTitles() {
  return (
    <div className="flex w-full max-w-2xl flex-col space-y-4 overflow-hidden pt-8">
      <motion.h1
        className="text-center text-4xl font-medium leading-tight text-foreground sm:text-5xl md:text-6xl"
        initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          duration: 1,
          ease,
          staggerChildren: 0.2,
        }}
      >
        {["Build", "stunning", "websites", "with ease"].map((text, index) => (
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
        ))}
      </motion.h1>
      <motion.p
        className="mx-auto max-w-xl text-center text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-9"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.6,
          duration: 0.8,
          ease,
        }}
      >
        Create beautiful, responsive websites using shadcn and magicui
        components. Export clean, production-ready code.
      </motion.p>
    </div>
  );
}

function HeroCTA() {
  return (
    <>
      <motion.div
        className="mt-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.8,
              duration: 0.8,
              ease: "easeOut",
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <AvatarCircles
          numPeople={99}
          avatarUrls={[
            "https://avatars.githubusercontent.com/u/106103625",
            "https://avatars.githubusercontent.com/u/106103625",
            "https://avatars.githubusercontent.com/u/106103625",
            "https://avatars.githubusercontent.com/u/106103625",
          ]}
        />
      </motion.div>

      <motion.div
        className="mx-auto mt-4 flex w-full max-w-2xl flex-col items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
      >
        <Link href="/editor" passHref>
          <Button
            variant="ringHover"
            className="w-full group transition-all duration-300"
          >
            Start building for free
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </motion.div>
    </>
  );
}

function HeroImage() {
  return (
    <motion.div
      className="relative mx-auto flex w-full items-center justify-center"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 1, ease }}
    >
      <HeroVideoDialog
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        thumbnailSrc="https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDRxusbm2_TGTnDWEIhBTYW2cUQkw"
        thumbnailAlt="Website Builder Demo"
        className="border rounded-lg shadow-lg max-w-screen-lg mt-16"
      />
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef(null);

  return (
    <div
      className="relative flex w-full flex-col items-center justify-start px-4 pt-10 mt:pt-24 sm:px-6 sm:pt-20 lg:px-8"
      id="hero"
      ref={ref}
    >
      <Spotlight
        className="absolute -top-20 left-20 md:left-40 md:-top-20"
        fill="white"
      />
      <HeroPill />
      <HeroTitles />
      <HeroCTA />
      <HeroImage />

      <div className="pointer-events-none absolute inset-x-0 -bottom-12 h-1/3 bg-gradient-to-t from-background via-background to-transparent lg:h-1/4"></div>
    </div>
  );
}
