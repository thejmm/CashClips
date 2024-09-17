import Marquee from "@/components/ui/marquee";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-cyan-600/20 p-1 py-0.5 font-bold text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-600",
        className,
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props // Capture the rest of the props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      // light styles
      " border border-neutral-200 bg-white",
      // dark styles
      "dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className,
    )}
    {...props} // Spread the rest of the props here
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
        <StarFilledIcon className="size-4 text-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <img
        src={img}
        className="h-10 w-10 rounded-full  ring-1 ring-border ring-offset-4"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Alex Rivera",
    role: "Twitch Streamer, 500K followers",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <>
        CashClips has revolutionized my content strategy.
        <Highlight>My clipping efficiency has increased 10x!</Highlight>{" "}
        It&apos;s a game-changer for streamers looking to boost engagement.
      </>
    ),
  },
  {
    name: "Samantha Lee",
    role: "YouTube Gaming Content Creator",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <>
        With CashClips, I can easily create highlights from my streams.
        <Highlight>
          Seeing a 50% increase in views on my highlight reels!
        </Highlight>{" "}
        Highly recommend for any content creator.
      </>
    ),
  },
  {
    name: "Raj Patel",
    role: "Esports Commentator & Clipper",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <>
        As a clipper, speed is everything. CashClips&apos; automated clipping
        assistant helps me stay ahead of the game.
        <Highlight>My clipping output has doubled.</Highlight> Essential tool
        for any esports content creator.
      </>
    ),
  },
  {
    name: "Emily Chen",
    role: "Multi-Platform Streamer",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <>
        CashClips&apos; multi-platform support has made managing my content
        across different streaming services a breeze.
        <Highlight>Clipping is now seamless and efficient.</Highlight> A
        must-have for streamers on multiple platforms.
      </>
    ),
  },
  {
    name: "Michael Brown",
    role: "Streamer Analytics Specialist",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    description: (
      <>
        The analytics provided by CashClips have given us incredible insights.
        <Highlight>
          Our clip performance and audience engagement metrics are now real-time
          and actionable.
        </Highlight>{" "}
        Transformative for optimizing content strategy.
      </>
    ),
  },
  {
    name: "Linda Wu",
    role: "Clip Channel Manager",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
    description: (
      <>
        CashClips&apos; batch processing tools have drastically reduced our clip
        creation time.
        <Highlight>
          Efficiency in clip management has never been better.
        </Highlight>{" "}
        Perfect for managing large volumes of content.
      </>
    ),
  },
  {
    name: "Carlos Gomez",
    role: "IRL Streamer",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
    description: (
      <>
        CashClips&apos; mobile app lets me clip on-the-go, which is perfect for
        my IRL streams.
        <Highlight>
          I can now capture and share moments instantly.
        </Highlight>{" "}
        It&apos;s revolutionized my real-time content creation.
      </>
    ),
  },
  {
    name: "Aisha Khan",
    role: "Beauty & Lifestyle Streamer",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    description: (
      <>
        CashClips&apos; customizable templates have elevated my content quality.
        <Highlight>
          My beauty tutorials are now more engaging with perfectly timed clips.
        </Highlight>{" "}
        It&apos;s transformed how I present my content.
      </>
    ),
  },
  {
    name: "Tom Chen",
    role: "Streaming Tech Reviewer",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    description: (
      <>
        Implementing CashClips in my tech review streams has significantly
        improved my content quality.
        <Highlight>
          Highlighting key moments in product reviews is now effortless.
        </Highlight>{" "}
        A milestone in streaming technology.
      </>
    ),
  },
  {
    name: "Sofia Patel",
    role: "Educational Content Creator",
    img: "https://randomuser.me/api/portraits/women/73.jpg",
    description: (
      <>
        CashClips&apos; AI-driven clipping has doubled the effectiveness of my
        educational content.
        <Highlight>
          Creating concise, informative clips is now automated.
        </Highlight>{" "}
        It&apos;s transforming how I deliver knowledge to my audience.
      </>
    ),
  },
  {
    name: "Jake Morrison",
    role: "Cybersecurity Streamer",
    img: "https://randomuser.me/api/portraits/men/25.jpg",
    description: (
      <>
        With CashClips, I can quickly highlight crucial cybersecurity tips from
        my streams.
        <Highlight>
          My educational clips are now more impactful and shareable.
        </Highlight>{" "}
        It&apos;s helping me spread awareness more effectively.
      </>
    ),
  },
  {
    name: "Nadia Ali",
    role: "Creative Coding Streamer",
    img: "https://randomuser.me/api/portraits/women/78.jpg",
    description: (
      <>
        CashClips&apos; precision editing tools have streamlined my coding
        tutorials.
        <Highlight>
          I can now highlight complex coding concepts with ease.
        </Highlight>{" "}
        A game-changer for educational tech content.
      </>
    ),
  },
  {
    name: "Omar Farooq",
    role: "Gaming News Channel Host",
    img: "https://randomuser.me/api/portraits/men/54.jpg",
    description: (
      <>
        CashClips&apos; real-time clipping feature has been invaluable for
        breaking news coverage.
        <Highlight>We can now deliver gaming news clips instantly.</Highlight> A
        catalyst for staying ahead in gaming journalism.
      </>
    ),
  },
];

export function SocialProofTestimonials() {
  return (
    <section id="testimonials">
      <div className="py-14">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mx-auto space-y-4 py-6 text-center">
            <h2 className="text-[14px] font-medium tracking-tight text-primary">
              TESTIMONIALS
            </h2>
            <h4 className="mx-auto mb-2 max-w-3xl text-balance text-[42px] font-medium tracking-tighter">
              What Our Customers Say
            </h4>
          </div>
          <div className="relative mt-6 max-h-[650px] overflow-hidden">
            <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
              {Array(Math.ceil(testimonials.length / 3))
                .fill(0)
                .map((_, i) => (
                  <Marquee
                    vertical
                    key={i}
                    className={cn({
                      "[--duration:60s]": i === 1,
                      "[--duration:30s]": i === 2,
                      "[--duration:70s]": i === 3,
                    })}
                  >
                    {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                      <TestimonialCard {...card} key={idx} />
                    ))}
                  </Marquee>
                ))}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-white from-20% dark:from-background"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-white from-20% dark:from-background"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
