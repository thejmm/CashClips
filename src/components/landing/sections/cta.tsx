// src/components/landing/sections/cta.tsx
import { ChevronRight, HeartHandshake } from "lucide-react";
import { motion, useInView } from "framer-motion";

import Link from "next/link";
import Marquee from "@/components/ui/marquee";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef } from "react";

const reviews = [
  {
    name: "Emma",
    username: "@emma_designs",
    body: "BuildFlow's drag-and-drop builder is incredible. I created a stunning website in hours, not days!",
    img: "https://avatar.vercel.sh/emma",
  },
  {
    name: "Liam",
    username: "@liam_seo_pro",
    body: "The SEO tool in BuildFlow caught issues I'd missed for years. My site's traffic has doubled!",
    img: "https://avatar.vercel.sh/liam",
  },
  {
    name: "Sophia",
    username: "@sophia_a11y",
    body: "BuildFlow's accessibility checker is a game-changer. My site is now truly inclusive!",
    img: "https://avatar.vercel.sh/sophia",
  },
  {
    name: "Noah",
    username: "@noah_content",
    body: "The metatags tool in BuildFlow boosted my content's visibility overnight. Amazing results!",
    img: "https://avatar.vercel.sh/noah",
  },
  {
    name: "Olivia",
    username: "@olivia_creative",
    body: "BuildFlow's theme generator helped me create a unique look for my brand in minutes. Love it!",
    img: "https://avatar.vercel.sh/olivia",
  },
  {
    name: "Ethan",
    username: "@ethan_startup",
    body: "As a non-coder, BuildFlow's drag-and-drop builder was a lifesaver for our startup's website.",
    img: "https://avatar.vercel.sh/ethan",
  },
  {
    name: "Ava",
    username: "@ava_ecommerce",
    body: "BuildFlow's SEO tool transformed our online store. Our product pages are ranking higher than ever!",
    img: "https://avatar.vercel.sh/ava",
  },
  {
    name: "Mason",
    username: "@mason_dev",
    body: "The accessibility tool in BuildFlow caught issues I'd overlooked. It's comprehensive and user-friendly.",
    img: "https://avatar.vercel.sh/mason",
  },
  {
    name: "Isabella",
    username: "@isabella_blogger",
    body: "BuildFlow's metatags tool simplified my SEO strategy. My blog posts are getting more traction now!",
    img: "https://avatar.vercel.sh/isabella",
  },
  {
    name: "James",
    username: "@james_designer",
    body: "The theme generator in BuildFlow is so intuitive. I created a stunning color scheme in no time!",
    img: "https://avatar.vercel.sh/james",
  },
  {
    name: "Charlotte",
    username: "@charlotte_nonprofit",
    body: "BuildFlow's drag-and-drop builder helped us create a professional site on a tight budget. Thank you!",
    img: "https://avatar.vercel.sh/charlotte",
  },
  {
    name: "Benjamin",
    username: "@benjamin_local",
    body: "The local SEO features in BuildFlow's SEO tool put my small business on the map. Literally!",
    img: "https://avatar.vercel.sh/benjamin",
  },
  {
    name: "Amelia",
    username: "@amelia_tech",
    body: "BuildFlow's accessibility checker ensures our app's landing page is usable by everyone. Crucial tool!",
    img: "https://avatar.vercel.sh/amelia",
  },
  {
    name: "Elijah",
    username: "@elijah_marketer",
    body: "The metatags tool in BuildFlow boosted our campaign landing pages' performance significantly.",
    img: "https://avatar.vercel.sh/elijah",
  },
  {
    name: "Mia",
    username: "@mia_artist",
    body: "BuildFlow's theme generator helped me create a cohesive look for my online portfolio. So easy to use!",
    img: "https://avatar.vercel.sh/mia",
  },
  {
    name: "Alexander",
    username: "@alexander_freelance",
    body: "As a freelancer, BuildFlow's drag-and-drop builder lets me create client sites quickly and professionally.",
    img: "https://avatar.vercel.sh/alexander",
  },
  {
    name: "Evelyn",
    username: "@evelyn_education",
    body: "BuildFlow's SEO tool helped our educational content reach more students. Invaluable for online learning!",
    img: "https://avatar.vercel.sh/evelyn",
  },
  {
    name: "Daniel",
    username: "@daniel_ux",
    body: "The accessibility checker in BuildFlow is now an essential part of our UX design process. Love it!",
    img: "https://avatar.vercel.sh/daniel",
  },
  {
    name: "Harper",
    username: "@harper_content",
    body: "BuildFlow's metatags tool simplified our content strategy. Our articles are more discoverable now!",
    img: "https://avatar.vercel.sh/harper",
  },
  {
    name: "Sebastian",
    username: "@sebastian_agency",
    body: "The theme generator in BuildFlow helps us quickly create on-brand websites for our clients. Time-saver!",
    img: "https://avatar.vercel.sh/sebastian",
  },
];

const firstRow = reviews.slice(reviews.length / 3, (reviews.length * 2) / 3);
const secondRow = reviews.slice(reviews.length / 3, (reviews.length * 2) / 3);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <motion.figure
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-[2rem] border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </motion.figure>
  );
};

export function CallToAction() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section id="cta" ref={sectionRef}>
      <div className="container mx-auto pb-12">
        <div className="flex w-full flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl border p-10 py-14"
          >
            <motion.div
              initial={{ opacity: 0, rotate: 35 }}
              animate={
                isInView
                  ? { opacity: 1, rotate: 35 }
                  : { opacity: 0, rotate: 35 }
              }
              transition={{ duration: 1, delay: 0.4 }}
              className="absolute"
            >
              <Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
                {firstRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:20s]"
                repeat={3}
              >
                {secondRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
                {firstRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:20s]"
                repeat={3}
              >
                {secondRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee pauseOnHover className="[--duration:20s]" repeat={3}>
                {firstRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
              <Marquee
                reverse
                pauseOnHover
                className="[--duration:20s]"
                repeat={3}
              >
                {secondRow.map((review) => (
                  <ReviewCard key={review.username} {...review} />
                ))}
              </Marquee>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }
              }
              transition={{ duration: 0.8, delay: 0.6 }}
              className="z-10 mx-auto size-24 rounded-[2rem] border bg-white/10 p-3 shadow-2xl backdrop-blur-md dark:bg-black/10 lg:size-32"
            >
              <HeartHandshake className="mx-auto size-16 text-black dark:text-white lg:size-24" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="z-10 mt-4 flex flex-col items-center text-center text-black dark:text-white"
            >
              <h1 className="text-3xl font-bold lg:text-4xl">
                Build 10X Faster With BuildFlow
              </h1>
              <p className="mt-2">
                Start building today. No credit card required.
              </p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={
                  isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, delay: 1 }}
              >
                <Link
                  href="/editor"
                  className={cn(
                    buttonVariants({
                      size: "lg",
                      variant: "outline",
                    }),
                    "group mt-4 rounded-[2rem] px-6",
                  )}
                >
                  Start Building
                  <ChevronRight className="ml-1 size-4 transition-all duration-300 ease-out group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </motion.div>
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-transparent to-white to-70% dark:to-black" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
