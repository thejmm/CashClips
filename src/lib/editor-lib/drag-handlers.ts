// src/lib/editor-lib/drag-handlers.ts

import {
  Position,
  Section,
  useEditorState,
} from "../../context/editor-context/editor-provider";
import React, { useCallback, useRef } from "react";

const GRID_SIZE = 10;

export const useDragHandlers = () => {
  const { state, dispatch } = useEditorState();
  const dragState = useRef<{
    isDragging: boolean;
    startPosition: Position;
    draggedElementId: string | null;
  }>({
    isDragging: false,
    startPosition: { x: 0, y: 0 },
    draggedElementId: null,
  });

  const getRelativePosition = useCallback(
    (clientX: number, clientY: number, containerRect: DOMRect): Position => {
      return {
        x: clientX - containerRect.left,
        y: clientY - containerRect.top,
      };
    },
    [],
  );

  const snapToGrid = useCallback((value: number): number => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, []);

  const handleDragStart = useCallback(
    (
      e: React.DragEvent<HTMLDivElement>,
      id: string,
      containerRect: DOMRect,
    ) => {
      e.stopPropagation();
      const startPosition = getRelativePosition(
        e.clientX,
        e.clientY,
        containerRect,
      );
      dragState.current = {
        isDragging: true,
        startPosition,
        draggedElementId: id,
      };
      dispatch({ type: "SELECT_ELEMENT", payload: id });
    },
    [dispatch, getRelativePosition],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const getNextAvailablePosition = useCallback(
    (sections: Section[], newSectionHeight: number): number => {
      if (sections.length === 0) return 0;
      const lastSection = sections[sections.length - 1];
      const lastSectionHeight =
        typeof lastSection.height === "number" ? lastSection.height : 600;
      return lastSection.position.y + lastSectionHeight;
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, containerRect: DOMRect) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text");
      const dropPosition = getRelativePosition(
        e.clientX,
        e.clientY,
        containerRect,
      );

      console.log("Handling drop:", { id, dropPosition });

      if (dragState.current.isDragging && dragState.current.draggedElementId) {
        const draggedElement =
          state.sections.find(
            (s) => s.id === dragState.current.draggedElementId,
          ) ||
          state.components.find(
            (c) => c.id === dragState.current.draggedElementId,
          );

        if (draggedElement) {
          if ("height" in draggedElement) {
            // Moving existing section
            console.log(
              "Moving existing section:",
              dragState.current.draggedElementId,
            );
            const newY = snapToGrid(dropPosition.y); // Snap to grid for better UX
            dispatch({
              type: "UPDATE_SECTION_POSITION",
              payload: {
                id: draggedElement.id,
                position: { y: newY },
              },
            });
          } else {
            // Moving existing component
            console.log(
              "Moving existing component:",
              dragState.current.draggedElementId,
            );
            dispatch({
              type: "UPDATE_COMPONENT_POSITION",
              payload: {
                id: draggedElement.id,
                position: {
                  x: snapToGrid(dropPosition.x),
                  y: snapToGrid(dropPosition.y),
                },
              },
            });
          }
        }
      } else {
        const [type, category, name] = id.split("-");
        if (type === "sections") {
          console.log("Adding new section:", id);
          const sectionTemplate = state.availableComponents[type]?.[
            category
          ]?.find((c) => c.id === id);

          if (!sectionTemplate) return;

          const newSectionHeight = sectionTemplate.customProps?.minHeight
            ? parseInt(sectionTemplate.customProps.minHeight, 10) // Get the height from the section template
            : 600; // Default height

          const newY = getNextAvailablePosition(
            state.sections,
            newSectionHeight,
          ); // Use the calculated height
          dispatch({
            type: "ADD_SECTION",
            payload: {
              id,
              position: { y: newY },
              height: newSectionHeight, // Use the calculated height
            },
          });
        } else {
          console.log("Adding new component:", id);
          dispatch({
            type: "ADD_COMPONENT",
            payload: {
              id,
              position: {
                x: snapToGrid(dropPosition.x),
                y: snapToGrid(dropPosition.y),
              },
            },
          });
        }
      }

      dragState.current = {
        isDragging: false,
        startPosition: { x: 0, y: 0 },
        draggedElementId: null,
      };
    },
    [
      dispatch,
      getRelativePosition,
      snapToGrid,
      state.sections,
      getNextAvailablePosition,
      state.availableComponents,
    ],
  );

  const handleDeleteElement = useCallback(
    (id: string) => {
      const isSection = state.sections.some((s) => s.id === id);
      if (isSection) {
        dispatch({ type: "REMOVE_SECTION", payload: id });
      } else {
        dispatch({ type: "REMOVE_COMPONENT", payload: id });
      }
    },
    [dispatch, state.sections],
  );

  return {
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDeleteElement,
  };
};
