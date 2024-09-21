import { motion, useInView } from "framer-motion";

// src/components/landing/sections/social-proof.tsx
import Marquee from "@/components/ui/marquee";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { useRef } from "react";

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
  ...props
}: TestimonialCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
        "border border-neutral-200 bg-white",
        "dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
        className,
      )}
      {...props}
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
          className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
          alt={name}
        />

        <div>
          <p className="font-medium text-neutral-500">{name}</p>
          <p className="text-xs font-normal text-neutral-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Updated testimonials array focusing on BuildFlow's core tools
const testimonials = [
  {
    name: "Alex Rivera",
    role: "Freelance Web Designer",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <p>
        BuildFlow&apos;s drag-and-drop editor is a game-changer.
        <Highlight>
          I can build complex layouts in minutes, not hours.
        </Highlight>{" "}
        It&apos;s revolutionized my workflow.
      </p>
    ),
  },
  {
    name: "Samantha Lee",
    role: "Digital Marketing Specialist",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        The SEO tool in BuildFlow is incredibly powerful.
        <Highlight>It caught issues I hadn&apos;t even considered.</Highlight>
        My clients&apos; sites are ranking better than ever.
      </p>
    ),
  },
  {
    name: "Raj Patel",
    role: "Startup Founder",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        As a non-coder, BuildFlow&apos;s drag-and-drop builder was a lifesaver.
        <Highlight>
          I built our entire company website myself in days.
        </Highlight>
        It&apos;s perfect for startups on a budget.
      </p>
    ),
  },
  {
    name: "Emily Chen",
    role: "UX Designer",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <p>
        The accessibility tool in BuildFlow is fantastic.
        <Highlight>
          It helps me ensure our sites are inclusive from the start.
        </Highlight>
        Essential for modern web design.
      </p>
    ),
  },
  {
    name: "Michael Brown",
    role: "Content Creator",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    description: (
      <p>
        BuildFlow&apos;s metatags tool is a game-changer for SEO.
        <Highlight>
          My content&apos;s visibility on search engines has skyrocketed.
        </Highlight>{" "}
        It&apos;s like having an SEO expert on call.
      </p>
    ),
  },
  {
    name: "Linda Wu",
    role: "E-commerce Store Owner",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
    description: (
      <p>
        The theme generator in BuildFlow is incredibly versatile.
        <Highlight>
          I created a unique look for my store in minutes.
        </Highlight>{" "}
        It&apos;s perfect for brand consistency.
      </p>
    ),
  },
  {
    name: "David Johnson",
    role: "Small Business Owner",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    description: (
      <p>
        BuildFlow&apos;s drag-and-drop editor made website creation a breeze.
        <Highlight>I updated our entire site over a weekend.</Highlight>
        It&apos;s incredibly intuitive, even for beginners.
      </p>
    ),
  },
  {
    name: "Sophie Martin",
    role: "SEO Consultant",
    img: "https://randomuser.me/api/portraits/women/28.jpg",
    description: (
      <p>
        The depth of BuildFlow&apos;s SEO tool impresses me every time.
        <Highlight>
          It provides insights that used to take hours of manual work.
        </Highlight>
        A must-have for serious SEO professionals.
      </p>
    ),
  },
  {
    name: "Mohammed Al-Fayed",
    role: "Non-profit Director",
    img: "https://randomuser.me/api/portraits/men/59.jpg",
    description: (
      <p>
        BuildFlow&apos;s accessibility checker has been crucial for our
        inclusive mission.
        <Highlight>
          We&apos;ve made our content accessible to everyone.
        </Highlight>
        It&apos;s an essential tool for socially responsible organizations.
      </p>
    ),
  },
  {
    name: "Emma Thompson",
    role: "Blogger",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    description: (
      <p>
        The metatags tool in BuildFlow simplified my SEO strategy.
        <Highlight>
          My blog posts are getting more organic traffic than ever.
        </Highlight>
        It&apos;s perfect for content creators focused on growth.
      </p>
    ),
  },
  {
    name: "Carlos Rodriguez",
    role: "Graphic Designer",
    img: "https://randomuser.me/api/portraits/men/67.jpg",
    description: (
      <p>
        BuildFlow&apos;s theme generator is a designer&apos;s dream.
        <Highlight>
          I can quickly create cohesive color schemes for clients.
        </Highlight>
        It&apos;s become an essential part of my design process.
      </p>
    ),
  },
  {
    name: "Aisha Patel",
    role: "Marketing Agency Owner",
    img: "https://randomuser.me/api/portraits/women/37.jpg",
    description: (
      <p>
        The drag-and-drop editor in BuildFlow has sped up our project delivery.
        <Highlight>
          We&apos;re completing client websites in half the time now.
        </Highlight>
        It&apos;s boosted our agency&apos;s productivity significantly.
      </p>
    ),
  },
  {
    name: "Thomas Wright",
    role: "Local Business Owner",
    img: "https://randomuser.me/api/portraits/men/85.jpg",
    description: (
      <p>
        BuildFlow&apos;s SEO tool helped put my business on the map.
        <Highlight>
          We&apos;re now ranking on the first page for local searches.
        </Highlight>
        It&apos;s been crucial for our online visibility.
      </p>
    ),
  },
  {
    name: "Olivia Chen",
    role: "Accessibility Advocate",
    img: "https://randomuser.me/api/portraits/women/62.jpg",
    description: (
      <p>
        The accessibility tool in BuildFlow is comprehensive and user-friendly.
        <Highlight>
          It&apos;s helping create a more inclusive web, one site at a time.
        </Highlight>
        A vital tool for web accessibility.
      </p>
    ),
  },
  {
    name: "Ryan O'Connor",
    role: "Startup CMO",
    img: "https://randomuser.me/api/portraits/men/93.jpg",
    description: (
      <p>
        BuildFlow&apos;s metatags tool streamlined our content strategy.
        <Highlight>
          Our content engagement and sharing have increased dramatically.
        </Highlight>
        It&apos;s a powerful tool for brand visibility.
      </p>
    ),
  },
  {
    name: "Zoe Williams",
    role: "Freelance Developer",
    img: "https://randomuser.me/api/portraits/women/14.jpg",
    description: (
      <p>
        The theme generator in BuildFlow saves me so much time.
        <Highlight>
          I can create custom themes for clients in minutes, not hours.
        </Highlight>
        It&apos;s become an indispensable tool in my workflow.
      </p>
    ),
  },
  {
    name: "Hassan Mahmoud",
    role: "E-learning Platform Founder",
    img: "https://randomuser.me/api/portraits/men/36.jpg",
    description: (
      <p>
        BuildFlow&apos;s drag-and-drop editor made creating our course pages a
        breeze.
        <Highlight>
          We launched our platform months ahead of schedule.
        </Highlight>
        It&apos;s perfect for educational websites.
      </p>
    ),
  },
  {
    name: "Lily Zhang",
    role: "SEO Manager",
    img: "https://randomuser.me/api/portraits/women/79.jpg",
    description: (
      <p>
        The depth of analysis in BuildFlow&apos;s SEO tool is impressive.
        <Highlight>
          It&apos;s helped us fine-tune our SEO strategy with precision.
        </Highlight>
        A must-have for data-driven SEO professionals.
      </p>
    ),
  },
  {
    name: "Gabriel Santos",
    role: "Web Accessibility Consultant",
    img: "https://randomuser.me/api/portraits/men/22.jpg",
    description: (
      <p>
        BuildFlow&apos;s accessibility tool is one of the most comprehensive
        I&apos;ve used.
        <Highlight>It catches issues that other tools miss.</Highlight>
        Essential for creating truly inclusive websites.
      </p>
    ),
  },
  {
    name: "Nadia Petrova",
    role: "Content Strategist",
    img: "https://randomuser.me/api/portraits/women/90.jpg",
    description: (
      <p>
        The metatags tool in BuildFlow has elevated our content strategy.
        <Highlight>
          Our articles are more discoverable and shareable now.
        </Highlight>
        It&apos;s a game-changer for content optimization.
      </p>
    ),
  },
  {
    name: "Marcus Johansen",
    role: "Brand Designer",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    description: (
      <p>
        BuildFlow&apos;s theme generator is incredibly intuitive.
        <Highlight>
          It helps me create on-brand color schemes effortlessly.
        </Highlight>
        A fantastic tool for maintaining brand consistency across websites.
      </p>
    ),
  },
  {
    name: "Fatima Al-Sayed",
    role: "Tech Blogger",
    img: "https://randomuser.me/api/portraits/women/33.jpg",
    description: (
      <p>
        The drag-and-drop editor in BuildFlow is surprisingly powerful.
        <Highlight>
          I can create complex layouts without touching code.
        </Highlight>
        It&apos;s perfect for tech-savvy content creators.
      </p>
    ),
  },
  {
    name: "Derek Chen",
    role: "E-commerce SEO Specialist",
    img: "https://randomuser.me/api/portraits/men/71.jpg",
    description: (
      <p>
        BuildFlow&apos;s SEO tool is tailored perfectly for e-commerce.
        <Highlight>
          It&apos;s helped boost our product pages&apos; rankings significantly.
        </Highlight>
        A must-have for online stores focused on growth.
      </p>
    ),
  },
  {
    name: "Isabella Rossi",
    role: "UX Researcher",
    img: "https://randomuser.me/api/portraits/women/46.jpg",
    description: (
      <p>
        The accessibility tool in BuildFlow aligns perfectly with our UX goals.
        <Highlight>
          It ensures we&apos;re creating inclusive experiences from the start.
        </Highlight>
        Crucial for user-centered design.
      </p>
    ),
  },
  {
    name: "Jamal Wilson",
    role: "Digital Marketing Consultant",
    img: "https://randomuser.me/api/portraits/men/53.jpg",
    description: (
      <p>
        BuildFlow&apos;s metatags tool has simplified our clients&apos; SEO
        strategies.
        <Highlight>
          We&apos;re seeing improved click-through rates across the board.
        </Highlight>
        It&apos;s an essential part of our marketing toolkit.
      </p>
    ),
  },
];

export function SocialProofTestimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section id="testimonials" ref={sectionRef}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="py-12 md:py-46"
      >
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-4 py-6 mx-auto"
          >
            <h4 className="text-[42px] font-medium mb-2 text-balance max-w-3xl mx-auto tracking-tighter">
              What our customers are saying
            </h4>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative mt-6 max-h-[650px] overflow-hidden"
          >
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
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
