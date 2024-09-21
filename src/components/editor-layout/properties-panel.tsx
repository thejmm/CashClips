// src/components/editor-components/properties-panel.tsx

import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { useEditorState } from "@/context/editor-context/editor-provider";

const PropertiesPanel: React.FC = () => {
  const { state, dispatch } = useEditorState();

  // Handle changes to property values
  const handlePropertyChange = (propertyPath: string[], value: any) => {
    dispatch({
      type: "UPDATE_SELECTED_ELEMENT_PROPERTY",
      payload: { propertyPath, value },
    });
  };

  // Render input fields based on property types
  const renderPropertyInput = (
    propName: string,
    propValue: any,
    path: string[] = [],
  ) => {
    const currentPath = [...path, propName];

    if (
      typeof propValue === "object" &&
      propValue !== null &&
      !Array.isArray(propValue)
    ) {
      return (
        <div key={propName} className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">{propName}</h4>
          <div className="pl-4">
            {Object.entries(propValue).map(([key, value]) =>
              renderPropertyInput(key, value, currentPath),
            )}
          </div>
        </div>
      );
    }

    let inputElement;
    switch (typeof propValue) {
      case "boolean":
        inputElement = (
          <input
            type="checkbox"
            checked={propValue}
            onChange={(e) =>
              handlePropertyChange(currentPath, e.target.checked)
            }
            className="mt-1 block"
          />
        );
        break;
      case "number":
        inputElement = (
          <input
            type="number"
            value={propValue}
            onChange={(e) =>
              handlePropertyChange(currentPath, Number(e.target.value))
            }
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        );
        break;
      case "string":
        if (propName.toLowerCase().includes("color")) {
          inputElement = (
            <input
              type="color"
              value={propValue}
              onChange={(e) =>
                handlePropertyChange(currentPath, e.target.value)
              }
              className="mt-1 block w-full"
            />
          );
        } else {
          inputElement = (
            <input
              type="text"
              value={propValue}
              onChange={(e) =>
                handlePropertyChange(currentPath, e.target.value)
              }
              className="mt-1 block w-full border rounded-md shadow-sm p-2"
            />
          );
        }
        break;
      default:
        inputElement = (
          <input
            type="text"
            value={JSON.stringify(propValue)}
            onChange={(e) =>
              handlePropertyChange(currentPath, JSON.parse(e.target.value))
            }
            className="mt-1 block w-full border rounded-md shadow-sm p-2"
          />
        );
    }

    return (
      <div key={propName} className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {propName}
        </label>
        {inputElement}
      </div>
    );
  };

  // Render the properties panel
  return (
    <div className="w-64 border-l p-2">
      <h2 className="text-lg font-semibold mb-4">Properties</h2>
      {state.selectedElement ? (
        <div>
          <h3 className="text-md font-medium mb-2">
            {state.selectedElement.name}
          </h3>
          <ScrollArea className="w-96 pr-3 h-[88svh] pb-4 overflow-auto">
            {renderPropertyInput(
              "properties",
              state.selectedElement.properties,
            )}
            {"height" in state.selectedElement &&
              renderPropertyInput("height", state.selectedElement.height)}
          </ScrollArea>
        </div>
      ) : (
        <p className="text-gray-500">Select an element to see properties</p>
      )}
    </div>
  );
};

export default PropertiesPanel;
