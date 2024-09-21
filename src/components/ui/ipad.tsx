import React from "react";
import { SVGProps } from "react";

export interface IpadProps extends SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  src?: string;
}

export default function Ipad({
  width = 820,
  height = 1180,
  src,
  ...props
}: IpadProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 60C2 26.8629 28.8629 0 62 0H758C791.137 0 818 26.8629 818 60V1120C818 1153.14 791.137 1180 758 1180H62C28.8629 1180 2 1153.14 2 1120V60Z"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <path
        d="M6 60C6 29.0721 31.0721 4 62 4H758C788.928 4 814 29.0721 814 60V1120C814 1150.93 788.928 1176 758 1176H62C31.0721 1176 6 1150.93 6 1120V60Z"
        className="dark:fill-[#262626] fill-white"
      />
      <path
        d="M21.25 75C21.25 44.2101 46.2101 19.25 77 19.25H743C773.79 19.25 798.75 44.2101 798.75 75V1105C798.75 1135.79 773.79 1160.75 743 1160.75H77C46.2101 1160.75 21.25 1135.79 21.25 1105V75Z"
        className="fill-[#E5E5E5] dark:fill-[#404040] stroke-[#E5E5E5] dark:stroke-[#404040] stroke-[0.5]"
      />
      {src && (
        <image
          href={src}
          x="21.25"
          y="19.25"
          width="777.5"
          height="1141.5"
          preserveAspectRatio="xMidYMid slice"
          clipPath="url(#ipadRoundedCorners)"
        />
      )}
      <circle
        cx="410"
        cy="40"
        r="8"
        className="fill-[#E5E5E5] dark:fill-[#404040]"
      />
      <defs>
        <clipPath id="ipadRoundedCorners">
          <rect
            x="21.25"
            y="19.25"
            width="777.5"
            height="1141.5"
            rx="55.75"
            ry="55.75"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
