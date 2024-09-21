import { ReactNode, SVGProps } from "react";

export interface SafariProps extends SVGProps<SVGSVGElement> {
  url?: string;
  children?: ReactNode;
}

export default function Safari({ url, children, ...props }: SafariProps) {
  return (
    <div className="w-full h-full flex flex-col">
      {/* Safari header */}
      <div className="h-16 bg-[#E5E5E5] dark:bg-[#404040] flex items-center px-4 rounded-t-lg">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        </div>
        <div className="flex-grow flex justify-center">
          <div className="bg-white dark:bg-[#262626] px-4 py-1 rounded-full text-xs text-gray-500">
            {url}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-grow rounded-b-lg overflow-hidden border border-x-4 border-b-4 border-t-0">
        {children}
      </div>
    </div>
  );
}
