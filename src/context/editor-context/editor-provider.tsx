// src/lib/editor-lib/editor-state.tsx

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { createClient } from "@/utils/supabase/component";
import { getAvailableComponents } from "../../lib/editor-lib/component-loader";

// Interfaces
export interface Position {
  x: number;
  y: number;
}

export interface Component {
  id: string;
  name: string;
  type: string;
  category: string;
  properties: Record<string, any>;
  position: Position;
  path: string;
  customProps?: Record<string, any>;
}

export interface Section extends Omit<Component, "position"> {
  position: { y: number };
  height: number | "auto" | "full";
}

// State
interface EditorState {
  projectId: string | null;
  projectName: string;
  sections: Section[];
  components: Component[];
  availableComponents: Record<
    string,
    Record<string, Omit<Component, "position">[]>
  >;
  selectedElement: Section | Component | null;
  isLoading: boolean;
  error: string | null;
}

// Actions
type Action =
  | {
      type: "SET_PROJECT";
      payload: {
        id: string;
        name: string;
        sections: Section[];
        components: Component[];
      };
    }
  | {
      type: "ADD_SECTION";
      payload: {
        id: string;
        position: { y: number };
        height?: number | "auto" | "full";
      };
    }
  | { type: "ADD_COMPONENT"; payload: { id: string; position: Position } }
  | { type: "REMOVE_SECTION"; payload: string }
  | { type: "REMOVE_COMPONENT"; payload: string }
  | { type: "UPDATE_SECTION"; payload: Section }
  | { type: "UPDATE_COMPONENT"; payload: Component }
  | { type: "SELECT_ELEMENT"; payload: string }
  | {
      type: "UPDATE_COMPONENT_POSITION";
      payload: { id: string; position: Position };
    }
  | {
      type: "UPDATE_SECTION_POSITION";
      payload: { id: string; position: { y: number } };
    }
  | {
      type: "UPDATE_SELECTED_ELEMENT_PROPERTY";
      payload: { propertyPath: string[]; value: any };
    }
  | {
      type: "UPDATE_CUSTOM_PROPS";
      payload: { id: string; customProps: Record<string, any> };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null };

// Helper functions
function updatePropertyByPath(obj: any, path: string[], value: any): any {
  const [head, ...rest] = path;
  if (rest.length === 0) {
    return { ...obj, [head]: value };
  }
  return { ...obj, [head]: updatePropertyByPath(obj[head], rest, value) };
}

function getNextAvailablePosition(
  sections: Section[],
  newSectionHeight: number | "auto" | "full",
): number {
  if (sections.length === 0) return 0;
  const lastSection = sections[sections.length - 1];
  return (
    lastSection.position.y +
    (typeof lastSection.height === "number" ? lastSection.height : 500)
  );
}

// Initial State
const initialState: EditorState = {
  projectId: null,
  projectName: "",
  sections: [],
  components: [],
  availableComponents:
    getAvailableComponents() as EditorState["availableComponents"],
  selectedElement: null,
  isLoading: false,
  error: null,
};

// Reducer
function editorReducer(state: EditorState, action: Action): EditorState {
  switch (action.type) {
    case "SET_PROJECT":
      return {
        ...state,
        projectId: action.payload.id,
        projectName: action.payload.name,
        sections: action.payload.sections,
        components: action.payload.components,
      };
    case "ADD_SECTION": {
      const [type, category] = action.payload.id.split("-");
      const sectionTemplate = state.availableComponents[type]?.[category]?.find(
        (c) => c.id === action.payload.id,
      );
      if (!sectionTemplate) return state;
      const newSection: Section = {
        ...sectionTemplate,
        position: {
          y: getNextAvailablePosition(
            state.sections,
            action.payload.height || 500,
          ),
        },
        height: action.payload.height || 500,
      };
      return { ...state, sections: [...state.sections, newSection] };
    }
    case "ADD_COMPONENT": {
      const [type, category] = action.payload.id.split("-");
      const componentTemplate = state.availableComponents[type]?.[
        category
      ]?.find((c) => c.id === action.payload.id);
      if (!componentTemplate) return state;
      const newComponent: Component = {
        ...componentTemplate,
        position: action.payload.position,
      };
      return { ...state, components: [...state.components, newComponent] };
    }
    case "REMOVE_SECTION":
      return {
        ...state,
        sections: state.sections.filter((s) => s.id !== action.payload),
        selectedElement:
          state.selectedElement?.id === action.payload
            ? null
            : state.selectedElement,
      };
    case "REMOVE_COMPONENT":
      return {
        ...state,
        components: state.components.filter((c) => c.id !== action.payload),
        selectedElement:
          state.selectedElement?.id === action.payload
            ? null
            : state.selectedElement,
      };
    case "UPDATE_SECTION":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.id ? action.payload : s,
        ),
        selectedElement:
          state.selectedElement?.id === action.payload.id
            ? action.payload
            : state.selectedElement,
      };
    case "UPDATE_COMPONENT":
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.payload.id ? action.payload : c,
        ),
        selectedElement:
          state.selectedElement?.id === action.payload.id
            ? action.payload
            : state.selectedElement,
      };
    case "SELECT_ELEMENT":
      return {
        ...state,
        selectedElement:
          state.sections.find((s) => s.id === action.payload) ||
          state.components.find((c) => c.id === action.payload) ||
          null,
      };
    case "UPDATE_COMPONENT_POSITION":
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.payload.id
            ? { ...c, position: action.payload.position }
            : c,
        ),
        selectedElement:
          state.selectedElement?.id === action.payload.id &&
          "position" in state.selectedElement
            ? { ...state.selectedElement, position: action.payload.position }
            : state.selectedElement,
      };
    case "UPDATE_SECTION_POSITION":
      return {
        ...state,
        sections: state.sections.map((s) =>
          s.id === action.payload.id
            ? { ...s, position: action.payload.position }
            : s,
        ),
        selectedElement:
          state.selectedElement?.id === action.payload.id &&
          "position" in state.selectedElement &&
          "height" in state.selectedElement
            ? { ...state.selectedElement, position: action.payload.position }
            : state.selectedElement,
      };
    case "UPDATE_SELECTED_ELEMENT_PROPERTY":
      if (!state.selectedElement) return state;
      const updatedElement = updatePropertyByPath(
        state.selectedElement,
        action.payload.propertyPath,
        action.payload.value,
      );
      return {
        ...state,
        selectedElement: updatedElement,
        sections: state.sections.map((s) =>
          s.id === updatedElement.id ? (updatedElement as Section) : s,
        ),
        components: state.components.map((c) =>
          c.id === updatedElement.id ? (updatedElement as Component) : c,
        ),
      };
    case "UPDATE_CUSTOM_PROPS":
      return {
        ...state,
        components: state.components.map((c) =>
          c.id === action.payload.id
            ? { ...c, customProps: action.payload.customProps }
            : c,
        ),
        sections: state.sections.map((s) =>
          s.id === action.payload.id
            ? { ...s, customProps: action.payload.customProps }
            : s,
        ),
        selectedElement:
          state.selectedElement?.id === action.payload.id
            ? {
                ...state.selectedElement,
                customProps: action.payload.customProps,
              }
            : state.selectedElement,
      };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

// Context
interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<Action>;
}

const EditorStateContext = createContext<EditorContextType | undefined>(
  undefined,
);

// Provider Component
interface EditorProviderProps {
  children: ReactNode;
  projectId?: string;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  projectId,
}) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const supabase = createClient();

  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProject = async (id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      dispatch({
        type: "SET_PROJECT",
        payload: {
          id: data.id,
          name: data.name,
          sections: data.sections || [],
          components: data.components || [],
        },
      });
    } catch (error) {
      console.error("Error loading project:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to load project" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const saveProject = async () => {
    if (!state.projectId) return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name: state.projectName,
          sections: state.sections,
          components: state.components,
        })
        .eq("id", state.projectId);

      if (error) throw error;
    } catch (error) {
      console.error("Error saving project:", error);
      dispatch({ type: "SET_ERROR", payload: "Failed to save project" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Debounce save function
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.projectId) {
        saveProject();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [state.sections, state.components]);

  return (
    <EditorStateContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorStateContext.Provider>
  );
};

// Custom Hook
export function useEditorState(): EditorContextType {
  const context = useContext(EditorStateContext);
  if (context === undefined) {
    throw new Error("useEditorState must be used within an EditorProvider");
  }
  return context;
}
