// src/lib/editor-lib/component-loader.ts

// Interface representing a component's definition
export interface ComponentDefinition {
  id: string; // Unique identifier for the component
  name: string; // Name of the component
  type: string; // Type of the component (e.g., 'components', 'sections')
  category: string; // Category of the component (e.g., 'shadcn', 'backgrounds')
  properties: Record<string, any>; // Properties for the component
  path: string; // Path to the component module
}

// Static mapping of our components categorized by type and category
const componentMap: Record<string, Record<string, string[]>> = {
  components: {
    shadcn: [
      "aspect-ratio",
      "container",
      "separator",
      "button",
      "checkbox",
      "form",
      "input",
      "input-otp",
      "label",
      "radio-group",
      "select",
      "slider",
      "switch",
      "textarea",
      "toggle",
      "avatar",
      "badge",
      "calendar",
      "card",
      "progress",
      "table",
      "tooltip",
      "breadcrumb",
      "dropdown-menu",
      "menubar",
      "navigation-menu",
      "pagination",
      "tabs",
      "alert",
      "alert-dialog",
      "dialog",
      "drawer",
      "popover",
      "sheet",
      "accordion",
      "collapsible",
      "command",
      "context-menu",
      "hover-card",
      "skeleton",
      "spinner",
      "carousel",
      "hero-video-dialog",
      "chart",
      "border-beam",
      "marquee",
      "resizable",
      "scroll-area",
      "sonner",
      "toggle-group",
    ],
  },
  sections: {
    authentication: ["authentication1", "authentication2"],
    "call-to-action": [
      "call-to-action1",
      "call-to-action2",
      "call-to-action3",
      "call-to-action4",
      "call-to-action5",
      "call-to-action6",
    ],
    backgrounds: ["dotted", "retro-grid"],
    faq: ["faq1", "faq2", "faq3", "faq4"],
    footer: [
      "footer1",
      "footer2",
      "footer3",
      "footer4",
      "footer5",
      "footer6",
      "footer7",
      "footer8",
      "footer9",
      "footer10",
      "footer11",
    ],
    header: ["header1", "header2", "header3", "header4", "header5", "header6"],
    hero: ["hero1", "hero2", "hero3"],
    pricing: [
      "pricing1",
      "pricing2",
      "pricing3",
      "pricing4",
      "pricing5",
      "pricing6",
      "pricing7",
      "pricing8",
      "pricing9",
    ],
    "social-proof": ["social-proof1", "social-proof2", "social-proof3"],
    stats: ["stats1"],
    testimonials: ["testimonials1"],
  },
};

// Dynamic import functions for components and sections
export const componentPaths: Record<string, () => Promise<any>> = {
  // Backgrounds
  dotted: () =>
    import("@/components/editor-components/sections/backgrounds/dotted"),
  "retro-grid": () =>
    import("@/components/editor-components/sections/backgrounds/retro-grid"),

  // Components
  accordion: () =>
    import("@/components/editor-components/components/accordion"),
  "alert-dialog": () =>
    import("@/components/editor-components/components/alert-dialog"),
  alert: () => import("@/components/editor-components/components/alert"),
  "aspect-ratio": () =>
    import("@/components/editor-components/components/aspect-ratio"),
  avatar: () => import("@/components/editor-components/components/avatar"),
  badge: () => import("@/components/editor-components/components/badge"),
  "border-beam": () =>
    import("@/components/editor-components/components/border-beam"),
  breadcrumb: () =>
    import("@/components/editor-components/components/breadcrumb"),
  button: () => import("@/components/editor-components/components/button"),
  calendar: () => import("@/components/editor-components/components/calendar"),
  card: () => import("@/components/editor-components/components/card"),
  carousel: () => import("@/components/editor-components/components/carousel"),
  chart: () => import("@/components/editor-components/components/chart"),
  checkbox: () => import("@/components/editor-components/components/checkbox"),
  collapsible: () =>
    import("@/components/editor-components/components/collapsible"),
  command: () => import("@/components/editor-components/components/command"),
  "context-menu": () =>
    import("@/components/editor-components/components/context-menu"),
  dialog: () => import("@/components/editor-components/components/dialog"),
  drawer: () => import("@/components/editor-components/components/drawer"),
  "dropdown-menu": () =>
    import("@/components/editor-components/components/dropdown-menu"),
  form: () => import("@/components/editor-components/components/form"),
  "hero-video-dialog": () =>
    import("@/components/editor-components/components/hero-video-dialog"),
  "hover-card": () =>
    import("@/components/editor-components/components/hover-card"),
  "input-otp": () =>
    import("@/components/editor-components/components/input-otp"),
  input: () => import("@/components/editor-components/components/input"),
  label: () => import("@/components/editor-components/components/label"),
  marquee: () => import("@/components/editor-components/components/marquee"),
  menubar: () => import("@/components/editor-components/components/menubar"),
  "navigation-menu": () =>
    import("@/components/editor-components/components/navigation-menu"),
  pagination: () =>
    import("@/components/editor-components/components/pagination"),
  popover: () => import("@/components/editor-components/components/popover"),
  progress: () => import("@/components/editor-components/components/progress"),
  "radio-group": () =>
    import("@/components/editor-components/components/radio-group"),
  resizable: () =>
    import("@/components/editor-components/components/resizable"),
  "scroll-area": () =>
    import("@/components/editor-components/components/scroll-area"),
  select: () => import("@/components/editor-components/components/select"),
  separator: () =>
    import("@/components/editor-components/components/separator"),
  sheet: () => import("@/components/editor-components/components/sheet"),
  skeleton: () => import("@/components/editor-components/components/skeleton"),
  slider: () => import("@/components/editor-components/components/slider"),
  sonner: () => import("@/components/editor-components/components/sonner"),
  switch: () => import("@/components/editor-components/components/switch"),
  table: () => import("@/components/editor-components/components/table"),
  tabs: () => import("@/components/editor-components/components/tabs"),
  textarea: () => import("@/components/editor-components/components/textarea"),
  "toggle-group": () =>
    import("@/components/editor-components/components/toggle-group"),
  toggle: () => import("@/components/editor-components/components/toggle"),
  tooltip: () => import("@/components/editor-components/components/tooltip"),

  // Sections
  authentication1: () =>
    import(
      "@/components/editor-components/sections/authentication/authentication1"
    ),
  authentication2: () =>
    import(
      "@/components/editor-components/sections/authentication/authentication2"
    ),
  "call-to-action1": () =>
    import(
      "@/components/editor-components/sections/call-to-action/call-to-action1"
    ),
  "call-to-action2": () =>
    import(
      "@/components/editor-components/sections/call-to-action/call-to-action2"
    ),
  "call-to-action3": () =>
    import(
      "@/components/editor-components/sections/call-to-action/call-to-action3"
    ),
  "call-to-action4": () =>
    import(
      "@/components/editor-components/sections/call-to-action/call-to-action4"
    ),
  "call-to-action5": () =>
    import(
      "@/components/editor-components/sections/call-to-action/call-to-action5"
    ),
  "call-to-action6": () =>
    import(
      "@/components/editor-components/sections/call-to-action/call-to-action6"
    ),
  faq1: () => import("@/components/editor-components/sections/faq/faq1"),
  faq2: () => import("@/components/editor-components/sections/faq/faq2"),
  faq3: () => import("@/components/editor-components/sections/faq/faq3"),
  faq4: () => import("@/components/editor-components/sections/faq/faq4"),
  footer1: () =>
    import("@/components/editor-components/sections/footer/footer1"),
  footer2: () =>
    import("@/components/editor-components/sections/footer/footer2"),
  footer3: () =>
    import("@/components/editor-components/sections/footer/footer3"),
  footer4: () =>
    import("@/components/editor-components/sections/footer/footer4"),
  footer5: () =>
    import("@/components/editor-components/sections/footer/footer5"),
  footer6: () =>
    import("@/components/editor-components/sections/footer/footer6"),
  footer7: () =>
    import("@/components/editor-components/sections/footer/footer7"),
  footer8: () =>
    import("@/components/editor-components/sections/footer/footer8"),
  footer9: () =>
    import("@/components/editor-components/sections/footer/footer9"),
  footer10: () =>
    import("@/components/editor-components/sections/footer/footer10"),
  footer11: () =>
    import("@/components/editor-components/sections/footer/footer11"),
  header1: () =>
    import("@/components/editor-components/sections/header/header1"),
  header2: () =>
    import("@/components/editor-components/sections/header/header2"),
  header3: () =>
    import("@/components/editor-components/sections/header/header3"),
  header4: () =>
    import("@/components/editor-components/sections/header/header4"),
  header5: () =>
    import("@/components/editor-components/sections/header/header5"),
  header6: () =>
    import("@/components/editor-components/sections/header/header6"),
  hero1: () => import("@/components/editor-components/sections/hero/hero1"),
  hero2: () => import("@/components/editor-components/sections/hero/hero2"),
  hero3: () => import("@/components/editor-components/sections/hero/hero3"),
  pricing1: () =>
    import("@/components/editor-components/sections/pricing/pricing1"),
  pricing2: () =>
    import("@/components/editor-components/sections/pricing/pricing2"),
  pricing3: () =>
    import("@/components/editor-components/sections/pricing/pricing3"),
  pricing4: () =>
    import("@/components/editor-components/sections/pricing/pricing4"),
  pricing5: () =>
    import("@/components/editor-components/sections/pricing/pricing5"),
  pricing6: () =>
    import("@/components/editor-components/sections/pricing/pricing6"),
  pricing7: () =>
    import("@/components/editor-components/sections/pricing/pricing7"),
  pricing8: () =>
    import("@/components/editor-components/sections/pricing/pricing8"),
  pricing9: () =>
    import("@/components/editor-components/sections/pricing/pricing9"),
  "social-proof1": () =>
    import(
      "@/components/editor-components/sections/social-proof/social-proof1"
    ),
  "social-proof2": () =>
    import(
      "@/components/editor-components/sections/social-proof/social-proof2"
    ),
  "social-proof3": () =>
    import(
      "@/components/editor-components/sections/social-proof/social-proof3"
    ),
  stats1: () => import("@/components/editor-components/sections/stats/stats1"),
  testimonials1: () =>
    import(
      "@/components/editor-components/sections/testimonials/testimonials1"
    ),

  // Placeholder component
  "component-placeholder": () =>
    import("@/components/editor-layout/component-placeholder"),
};

// Function to get available components with their definitions
export function getAvailableComponents(): Record<
  string,
  Record<string, ComponentDefinition[]>
> {
  const availableComponents: Record<
    string,
    Record<string, ComponentDefinition[]>
  > = {};

  // Iterate over the component map and generate component definitions
  Object.entries(componentMap).forEach(([type, categories]) => {
    availableComponents[type] = {};
    Object.entries(categories).forEach(([category, components]) => {
      availableComponents[type][category] = components.map((component) => ({
        id: `${type}-${category}-${component}`,
        name: component,
        type: type,
        category: category,
        properties: {},
        path: component,
      }));
    });
  });

  return availableComponents;
}
