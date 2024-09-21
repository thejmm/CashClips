import React, { useEffect, useState } from "react";

import ComponentPalette from "@/components/editor-layout/component-pallette";
import EditorCanvas from "@/components/editor-layout/editor-canvas";
import { EditorProvider } from "@/context/editor-context/editor-provider";
import { Loader } from "lucide-react";
import PropertiesPanel from "@/components/editor-layout/properties-panel";
import TopBar from "@/components/editor-layout/top-bar";
import { createClient } from "@/utils/supabase/component";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter } from "next/router";

interface ProjectData {
  id: string;
  name: string;
  sections: any[];
  components: any[];
}

interface EditorContentProps {
  projectData: ProjectData;
}

const EditorContent: React.FC<EditorContentProps> = ({ projectData }) => {
  const [viewport, setViewport] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  return (
    <div className="flex flex-col h-screen">
      <TopBar
        projectName={projectData.name}
        viewport={viewport}
        setViewport={setViewport}
      />
      <div className="flex flex-1 overflow-hidden">
        <ComponentPalette />
        <EditorCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
};

const EditorPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const supabase = createClient();
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (id && typeof id === "string") {
      const fetchProjectData = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();
          if (error) throw error;
          setProjectData(data);
        } catch (error) {
          console.error("Error fetching project data:", error);
          // Handle error (e.g., show error message, redirect)
        } finally {
          setIsLoading(false);
        }
      };
      fetchProjectData();
    } else {
      setIsLoading(false);
    }
  }, [id, supabase]);

  if (!isLargeScreen) {
    return (
      <div className="flex items-center justify-center h-screen p-4 text-center">
        <p className="text-lg font-semibold">
          Please use a larger device to access the editor.
        </p>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Project not found</p>
      </div>
    );
  }

  return (
    <EditorProvider projectId={projectData.id}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <EditorContent projectData={projectData} />
      )}
    </EditorProvider>
  );
};

export default EditorPage;
