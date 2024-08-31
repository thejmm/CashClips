import { DefaultSource, defaultSources } from "@/utils/creatomate/templates";

// src/components/user/sections/HomeDashboard.tsx
import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { videoCreator } from "@/store/creatomate";

const HomeDashboard: React.FC = observer(() => {
  const router = useRouter();

  const handleTemplateSelect = async (template: DefaultSource) => {
    try {
      await videoCreator.setSelectedSource(template);
      router.push("/editor");
    } catch (err) {
      console.error("Failed to set template:", err);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Select a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {defaultSources.map((template) => (
          <div
            key={template.name}
            className="border p-4 rounded cursor-pointer hover:border-blue-500"
            onClick={() => handleTemplateSelect(template)}
          >
            <img
              src={template.coverImage}
              alt={template.name}
              className="w-full h-64 object-cover mb-2"
            />
            <p className="text-center">{template.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
});

export default HomeDashboard;
