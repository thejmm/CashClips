// src/components/editor-layout/component-renderer.tsx

import {
  Component,
  Section,
} from "../../context/editor-context/editor-provider";

import React from "react";
import { componentPaths } from "../../lib/editor-lib/component-loader";
import dynamic from "next/dynamic";

const ElementWrapper = ({
  element,
  DynamicComponent,
}: {
  element: Component | Section;
  DynamicComponent: React.ComponentType<any>;
}) => {
  const { name, type, category, properties } = element;
  console.log("Rendering element:", { name, type, category });
  return (
    <DynamicComponent
      name={name}
      type={type}
      category={category}
      {...properties}
    />
  );
};

export function renderComponent(element: Component | Section) {
  console.log("Rendering element:", element);

  const LoadingComponent = () => {
    console.log("Rendering loading component for:", element.name);
    return <div>Loading {element.name}...</div>;
  };
  LoadingComponent.displayName = `Loading(${element.name})`;

  const ErrorComponent = () => {
    console.error("Error loading component:", element.name);
    return <div>Error loading component: {element.name}</div>;
  };
  ErrorComponent.displayName = `Error(${element.name})`;

  // Use dynamic with no SSR to ensure client-side only rendering
  const DynamicComponent = dynamic(
    () =>
      componentPaths[element.path]()
        .then((mod) => {
          // Check if the module has a default export
          if (mod.default) {
            return mod.default;
          }
          // If no default export, return the entire module
          return mod;
        })
        .catch((error) => {
          console.error(`Failed to load component: ${element.path}`, error);
          return componentPaths["component-placeholder"]().then(
            (mod) => mod.default,
          );
        }),
    {
      loading: LoadingComponent,
      ssr: false,
    },
  );

  return (
    <div key={element.id} className="mb-4">
      <ElementWrapper element={element} DynamicComponent={DynamicComponent} />
    </div>
  );
}
