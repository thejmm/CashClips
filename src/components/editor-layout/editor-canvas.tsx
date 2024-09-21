import React, { useCallback, useEffect, useRef } from "react";

import { createRoot } from "react-dom/client";
import { renderComponent } from "@/components/editor-layout/component-renderer";
import { useDragHandlers } from "@/lib/editor-lib/drag-handlers";
import { useEditorState } from "@/context/editor-context/editor-provider";

const EditorCanvas: React.FC = () => {
  const { state, dispatch } = useEditorState();
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { handleDragStart, handleDragOver, handleDrop, handleDeleteElement } =
    useDragHandlers();

  const onDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>, id: string) => {
      if (iframeRef.current) {
        handleDragStart(e, id, iframeRef.current.getBoundingClientRect());
      }
    },
    [handleDragStart],
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (iframeRef.current) {
        handleDrop(e, iframeRef.current.getBoundingClientRect());
      }
    },
    [handleDrop],
  );

  const onClickElement = useCallback(
    (id: string) => {
      dispatch({ type: "SELECT_ELEMENT", payload: id });
    },
    [dispatch],
  );

  const onDeleteElement = useCallback(
    (id: string) => {
      handleDeleteElement(id);
    },
    [handleDeleteElement],
  );

  useEffect(() => {
    const renderIframeContent = () => {
      const iframeDocument =
        iframeRef.current?.contentDocument ||
        iframeRef.current?.contentWindow?.document;
      if (iframeDocument) {
        const canvasRoot = iframeDocument.getElementById("canvas-root");
        if (canvasRoot) {
          canvasRoot.innerHTML = "";
          state.sections.forEach((section) => {
            const sectionElement = iframeDocument.createElement("div");
            sectionElement.style.position = "absolute";
            sectionElement.style.left = "0";
            sectionElement.style.right = "0";
            sectionElement.style.top = `${section.position.y}px`;
            sectionElement.style.height = `${section.height}px`;
            sectionElement.draggable = true;
            sectionElement.addEventListener("dragstart", (e) =>
              onDragStart(e as any, section.id),
            );
            sectionElement.addEventListener("click", () =>
              onClickElement(section.id),
            );
            sectionElement.addEventListener("contextmenu", (e) => {
              e.preventDefault();
              onDeleteElement(section.id);
            });
            canvasRoot.appendChild(sectionElement);
            const root = createRoot(sectionElement);
            root.render(renderComponent(section));
          });

          state.components.forEach((component) => {
            const componentElement = iframeDocument.createElement("div");
            componentElement.style.position = "absolute";
            componentElement.style.left = `${component.position.x}px`;
            componentElement.style.top = `${component.position.y}px`;
            componentElement.draggable = true;
            componentElement.addEventListener("dragstart", (e) =>
              onDragStart(e as any, component.id),
            );
            componentElement.addEventListener("click", () =>
              onClickElement(component.id),
            );
            componentElement.addEventListener("contextmenu", (e) => {
              e.preventDefault();
              onDeleteElement(component.id);
            });
            canvasRoot.appendChild(componentElement);
            const root = createRoot(componentElement);
            root.render(renderComponent(component));
          });
        }
      }
    };

    if (typeof window !== "undefined") {
      renderIframeContent();
    }
  }, [state, onDragStart, onClickElement, onDeleteElement]);

  return (
    <div
      ref={canvasRef}
      className="flex-1 p-4 overflow-auto relative bg-gray-200 flex items-center justify-center"
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full border-0 bg-white shadow-lg"
        onLoad={() => {
          const iframeDocument =
            iframeRef.current?.contentDocument ||
            iframeRef.current?.contentWindow?.document;
          if (iframeDocument) {
            iframeDocument.body.innerHTML = '<div id="canvas-root"></div>';
          }
        }}
      />
    </div>
  );
};

export default EditorCanvas;
