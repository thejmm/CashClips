// src/components/user/create/template.tsx
import React, { useEffect } from "react";

import { DefaultSource } from "@/utils/creatomate/templates";
import { motion } from "framer-motion";

interface TemplateProps {
  selectedTemplate: DefaultSource | null;
  handleTemplateSelect: (template: DefaultSource) => void;
  defaultSources: DefaultSource[];
}

const Template: React.FC<TemplateProps> = ({
  selectedTemplate,
  handleTemplateSelect,
  defaultSources,
}) => {
  useEffect(() => {
    console.log("Template component mounted");
    console.log(
      "Available templates:",
      defaultSources.map((t) => t.name),
    );
    console.log("Selected template:", selectedTemplate?.name);
  }, [selectedTemplate, defaultSources]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {defaultSources.map((template) => (
        <motion.div
          key={template.name}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`border p-4 rounded cursor-pointer transition-colors duration-200 ${
            selectedTemplate?.name === template.name
              ? "border-blue-500 border-2"
              : "hover:border-blue-500"
          }`}
          onClick={() => {
            console.log("Template selected:", template.name);
            handleTemplateSelect(template);
          }}
        >
          <img
            src={template.coverImage}
            alt={template.name}
            className="w-full h-48 object-cover mb-2 rounded"
          />
          <p className="text-center font-medium">{template.name}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Template;
