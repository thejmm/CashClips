// src/components/editor-components/component-placeholder.tsx

import React from "react";

interface PlaceholderProps {
  name: string;
  type: string;
  category: string;
}

const Placeholder: React.FC<PlaceholderProps> = ({ name, type, category }) => {
  return (
    <div className="border border-dashed border-gray-300 p-4 rounded">
      <h3 className="font-bold">{name}</h3>
      <p>Type: {type}</p>
      <p>Category: {category}</p>
    </div>
  );
};

export default Placeholder;
