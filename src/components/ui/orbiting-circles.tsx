import React from "react";
import { cn } from "@/lib/utils";

export interface OrbitingCirclesProps {
  className?: string;
  children?: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  delay?: number;
  radius?: number;
  smRadius?: number;
  path?: boolean;
}

export default function OrbitingCircles({
  className,
  children,
  reverse,
  duration = 20,
  delay = 10,
  radius = 50,
  smRadius,
  path = true,
}: OrbitingCirclesProps) {
  const [currentRadius, setCurrentRadius] = React.useState(radius);

  React.useEffect(() => {
    const handleResize = () => {
      if (smRadius && window.innerWidth >= 640) {
        setCurrentRadius(smRadius);
      } else {
        setCurrentRadius(radius);
      }
    };

    handleResize(); // Set initial radius
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [radius, smRadius]);

  return (
    <>
      {path && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <circle
            className="stroke-black/10 stroke-1 dark:stroke-white/10"
            cx="50%"
            cy="50%"
            r={currentRadius}
            fill="none"
          />
        </svg>
      )}
      <div
        style={
          {
            "--duration": duration,
            "--radius": currentRadius,
            "--delay": -delay,
          } as React.CSSProperties
        }
        className={cn(
          "absolute flex size-full transform-gpu animate-orbit items-center justify-center rounded-full border bg-black/10 [animation-delay:calc(var(--delay)*1000ms)] dark:bg-white/10",
          { "[animation-direction:reverse]": reverse },
          className,
        )}
      >
        {children}
      </div>
    </>
  );
}
