import { Monitor, Smartphone, Tablet } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { Button } from "../ui/button";
import { DashboardIcon } from "@radix-ui/react-icons";
import ExportDialog from "./export-dialog";
import Link from "next/link";
import React from "react";

interface TopBarProps {
  projectName: string;
  viewport: "mobile" | "tablet" | "desktop";
  setViewport: (viewport: "mobile" | "tablet" | "desktop") => void;
}

const TopBar: React.FC<TopBarProps> = ({
  projectName,
  viewport,
  setViewport,
}) => {
  return (
    <div className="border-b p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          title="brand-logo"
          className="relative flex items-center space-x-2"
        >
          <DashboardIcon className="h-6 w-6" />
          <span className="font-bold text-xl">BUILDFLOW</span>
        </Link>
        <span className="text-lg font-semibold">{projectName}</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2 mr-12">
          <ToggleGroup
            className="border rounded-lg"
            type="single"
            value={viewport}
            onValueChange={(value) => {
              if (value) setViewport(value as "mobile" | "tablet" | "desktop");
            }}
          >
            <ToggleGroupItem
              className="p-2"
              value="mobile"
              aria-label="Toggle mobile view"
            >
              <Smartphone className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              className="p-2"
              value="tablet"
              aria-label="Toggle tablet view"
            >
              <Tablet className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem
              className="p-2"
              value="desktop"
              aria-label="Toggle desktop view"
            >
              <Monitor className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div></div>
        <Button variant="ringHoverOutline">Preview Site</Button>

        <ExportDialog />
      </div>
    </div>
  );
};

export default TopBar;
