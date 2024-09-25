import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="hero" className="py-16 lg:py-24 lg:pb-36">
      <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          {/* Text Section */}
          <motion.div
            className="flex flex-col justify-center text-center items-center xl:justify-start xl:text-start xl:items-start mx-auto xl:ml-4 xl:mx-0 space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-2 mx-auto xl:text-left xl:mx-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-balance max-w-3xl mx-auto tracking-tighter xl:mx-0">
                Create Viral Clips in Seconds with CashClips
              </h1>
            </div>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto xl:mx-0">
              Transform your content into engaging, shareable clips across all
              major platforms. CashClips makes it easy to boost your online
              presence and grow your audience.
            </p>
            <Link href="/login" passHref>
              <Button
                variant="ringHover"
                className="my-2 mx-auto xl:mx-0 justify-center group rounded-full"
                size="lg"
              >
                Start Cash Clipping
                <ChevronRightIcon className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-row items-center justify-center space-x-4">
              <video
                className="rounded-lg object-contain h-36 md:h-80 w-auto"
                autoPlay
                muted
                loop
                controls={false}
                playsInline
              >
                <source src="/assets/share2.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <video
                className="rounded-lg object-contain h-52 md:h-96 w-auto"
                autoPlay
                muted
                loop
                controls={false}
                playsInline
              >
                <source src="/assets/share1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <video
                className="rounded-lg object-contain h-36 md:h-80 w-auto"
                autoPlay
                muted
                loop
                controls={false}
                playsInline
              >
                <source src="/assets/share3.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
