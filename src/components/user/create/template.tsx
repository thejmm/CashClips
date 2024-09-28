// src/components/user/create/template.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { DefaultSource } from "@/utils/creatomate/template-types";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useMediaQuery } from "react-responsive";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [searchTerm, setSearchTerm] = useState("");
  const isLg = useMediaQuery({ query: "(min-width: 1024px)" });
  const isMd = useMediaQuery({ query: "(min-width: 640px)" });

  useEffect(() => {
    if (isLg) {
      setPageSize(8);
    } else if (isMd) {
      setPageSize(6);
    } else {
      setPageSize(4);
    }
  }, [isLg, isMd]);

  const filteredTemplates = defaultSources.filter((template) =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTemplates.length / pageSize);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Search bar */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search templates..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
          className="w-full rounded border border-gray-300 p-2"
        />
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {paginatedTemplates.length > 0 ? (
          paginatedTemplates.map((template) => (
            <motion.div
              key={template.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer rounded border p-4 transition-colors duration-200 ${
                selectedTemplate?.name === template.name
                  ? "border-2 border-primary"
                  : "hover:border-primary"
              }`}
              onClick={() => {
                handleTemplateSelect(template);
              }}
            >
              <img
                src={template.coverImage}
                alt={template.name}
                className="mb-2 h-48 w-full rounded object-cover"
              />
              <p className="text-center font-medium">{template.name}</p>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center">No templates found.</p>
        )}
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col items-center justify-between space-y-4 py-4 sm:flex-row sm:space-y-0">
        <div className="text-sm text-gray-500">
          {filteredTemplates.length > 0 ? (
            <>
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, filteredTemplates.length)} of{" "}
              {filteredTemplates.length} templates
            </>
          ) : (
            "No templates available"
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4 sm:ml-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Template;
