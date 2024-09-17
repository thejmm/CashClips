import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section id="hero" className="py-16">
      <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center space-y-2 mx-auto lg:text-left lg:mx-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-balance max-w-3xl mx-auto tracking-tighter lg:mx-0">
                Create Viral Clips in Seconds with CashClips
              </h1>
            </div>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[600px] mx-auto lg:mx-0">
              Transform your content into engaging, shareable clips across all
              major platforms. CashClips makes it easy to boost your online
              presence and grow your audience.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/login" passHref>
                <Button
                  variant="ringHover"
                  className="my-2 group rounded-full"
                  size="lg"
                >
                  Start Clipping Today
                  <ChevronRightIcon className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              alt="CashClips interface showcase"
              className="aspect-video object-cover rounded-lg shadow-xl"
              src="https://via.placeholder.com/800x500.png?text=CashClips+Interface"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
