// src\components\landing\sections\bento\drag-and-drop.tsx

import { AnimatePresence, motion, useDragControls } from "framer-motion";
import {
  Box,
  Image,
  Minus,
  Move,
  Plus,
  Redo,
  Trash2,
  Type,
  Undo,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type ElementType = "text" | "image" | "shape";

interface Element {
  id: number;
  type: ElementType;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const DragAndDropEditor: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElements, setSelectedElements] = useState<number[]>([]);
  const [zoom, setZoom] = useState(1);
  const [history, setHistory] = useState<Element[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const editorRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const addToHistory = useCallback(
    (newElements: Element[]) => {
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newElements]);
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex],
  );

  const addElement = (type: ElementType) => {
    const newElement: Element = {
      id: Date.now(),
      type,
      content: type === "text" ? "Edit me" : "",
      x: 0,
      y: 0,
      width: type === "image" ? 100 : 150,
      height: type === "image" ? 100 : 40,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
  };

  const removeElement = (id: number) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    setSelectedElements(selectedElements.filter((selId) => selId !== id));
    addToHistory(newElements);
  };

  const updateElement = (id: number, updates: Partial<Element>) => {
    const newElements = elements.map((el) =>
      el.id === id ? { ...el, ...updates } : el,
    );
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleDragStart = (event: React.PointerEvent, id: number) => {
    if (!selectedElements.includes(id)) {
      setSelectedElements([id]);
    }
    dragControls.start(event);
  };

  const handleDrag = (event: any, info: any, id: number) => {
    if (!editorRef.current) return;
    const { width, height } = editorRef.current.getBoundingClientRect();
    const newElements = elements.map((el) => {
      if (selectedElements.includes(el.id)) {
        let newX = el.x + info.delta.x / zoom;
        let newY = el.y + info.delta.y / zoom;
        newX = Math.round(newX / 10) * 10; // Snap to grid
        newY = Math.round(newY / 10) * 10; // Snap to grid
        newX = Math.max(0, Math.min(newX, width / zoom - el.width));
        newY = Math.max(0, Math.min(newY, height / zoom - el.height));
        return { ...el, x: newX, y: newY };
      }
      return el;
    });
    setElements(newElements);
  };

  const handleDragEnd = () => {
    addToHistory(elements);
  };

  const handleResize = (id: number, direction: "increase" | "decrease") => {
    const change = direction === "increase" ? 10 : -10;
    const newElements = elements.map((el) => {
      if (selectedElements.includes(el.id)) {
        return {
          ...el,
          width: Math.max(50, el.width + change),
          height: Math.max(30, el.height + change),
        };
      }
      return el;
    });
    setElements(newElements);
    addToHistory(newElements);
  };

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        // metaKey for Mac
        switch (event.key.toLowerCase()) {
          case "z":
            event.preventDefault();
            handleUndo();
            break;
          case "y":
            event.preventDefault();
            handleRedo();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    const handleResize = () => {
      // Adjust element positions if necessary when window is resized
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const renderElement = (el: Element) => {
    switch (el.type) {
      case "text":
        return (
          <Input
            value={el.content}
            onChange={(e) => updateElement(el.id, { content: e.target.value })}
            className="w-full h-full bg-transparent border-none"
          />
        );
      case "image":
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Image size={24} />
          </div>
        );
      case "shape":
        return <div className="w-full h-full bg-blue-500 rounded" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-full bg-neutral-100 rounded-lg overflow-hidden">
      <div className="absolute top-2 left-2 bg-white p-2 rounded shadow z-10 flex flex-wrap gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="sm">
              <Plus size={14} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => addElement("text")}>
                <Type size={14} className="mr-2" /> Text
              </Button>
              <Button size="sm" onClick={() => addElement("image")}>
                <Image size={14} className="mr-2" /> Image
              </Button>
              <Button size="sm" onClick={() => addElement("shape")}>
                <Box size={14} className="mr-2" /> Shape
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button size="sm" onClick={handleUndo}>
          <Undo size={14} />
        </Button>
        <Button size="sm" onClick={handleRedo}>
          <Redo size={14} />
        </Button>
        <Button
          size="sm"
          onClick={() => setZoom((prev) => Math.min(prev + 0.1, 2))}
        >
          <ZoomIn size={14} />
        </Button>
        <Button
          size="sm"
          onClick={() => setZoom((prev) => Math.max(prev - 0.1, 0.5))}
        >
          <ZoomOut size={14} />
        </Button>
      </div>
      <div
        ref={editorRef}
        className="h-full p-4 relative overflow-hidden"
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
      >
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-1 pointer-events-none">
          {[...Array(144)].map((_, i) => (
            <div key={i} className="border border-gray-200" />
          ))}
        </div>
        <AnimatePresence>
          {elements.map((el) => (
            <motion.div
              key={el.id}
              drag
              dragControls={dragControls}
              dragMomentum={false}
              dragConstraints={editorRef}
              onPointerDown={(event) => handleDragStart(event, el.id)}
              onDrag={(event, info) => handleDrag(event, info, el.id)}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: el.x,
                y: el.y,
                width: el.width,
                height: el.height,
                boxShadow: selectedElements.includes(el.id)
                  ? "0 0 0 2px #3b82f6"
                  : "none",
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute bg-white rounded shadow-md cursor-move flex flex-col"
              style={{ width: el.width, height: el.height }}
            >
              {renderElement(el)}
              <div className="absolute top-0 right-0 flex gap-1 bg-white rounded-bl shadow-sm">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleResize(el.id, "decrease")}
                >
                  <Minus size={12} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleResize(el.id, "increase")}
                >
                  <Plus size={12} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeElement(el.id)}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DragAndDropEditor;
