// src/utils/creatomate/template-types.ts
type RelativeUnit =
  | `${number}%` // represents a percentage in relation to the element's composition
  | `${number}vw` // represents a percentage in relation to the template's width
  | `${number}vh` // represents a percentage in relation to the template's height
  | `${number}vmin` // represents a percentage based on the smallest side of the template
  | `${number}vmax` // represents a percentage based on the largest side of the template
  | `${number}px`; // represents an absolute size in screen pixels

interface CommonElementProperties {
  track?: number | null;
  time?: number | null;
  duration?: number | null;
  dynamic?: boolean;
  locked?: boolean;
  visible?: boolean;
  x?: RelativeUnit;
  y?: RelativeUnit;
  width?: RelativeUnit;
  height?: RelativeUnit;
  aspect_ratio?: number | null;
  x_padding?: RelativeUnit;
  y_padding?: RelativeUnit;
  z_index?: number | null;
  x_anchor?: RelativeUnit;
  y_anchor?: RelativeUnit;
  x_scale?: RelativeUnit;
  y_scale?: RelativeUnit;
  x_skew?: RelativeUnit;
  y_skew?: RelativeUnit;
  x_rotation?: RelativeUnit;
  y_rotation?: RelativeUnit;
  z_rotation?: RelativeUnit;
  perspective?: number | null;
  backface_visible?: boolean;
  x_alignment?: RelativeUnit;
  y_alignment?: RelativeUnit;
  fill_color?: string | string[] | null;
  fill_mode?: "solid" | "linear" | "radial";
  fill_x0?: RelativeUnit;
  fill_y0?: RelativeUnit;
  fill_x1?: RelativeUnit;
  fill_y1?: RelativeUnit;
  fill_radius?: RelativeUnit;
  stroke_color?: string | null;
  stroke_width?: RelativeUnit;
  stroke_cap?: "butt" | "square" | "round";
  stroke_join?: "miter" | "bevel" | "round";
  stroke_start?: RelativeUnit;
  stroke_end?: RelativeUnit;
  stroke_offset?: RelativeUnit;
  border_radius?: RelativeUnit;
  shadow_color?: string | null;
  shadow_blur?: RelativeUnit;
  shadow_x?: RelativeUnit;
  shadow_y?: RelativeUnit;
  clip?: boolean;
  opacity?: RelativeUnit;
  blend_mode?:
    | "none"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "lighter"
    | "difference"
    | "exclusion"
    | "hue"
    | "saturation"
    | "color"
    | "luminosity";
  color_filter?:
    | "none"
    | "brighten"
    | "contrast"
    | "hue"
    | "invert"
    | "grayscale"
    | "sepia";
  color_filter_value?: RelativeUnit;
  color_overlay?: string | null;
  blur_radius?: number;
  blur_mode?: "stack" | "box" | "box-2";
  mask_mode?: "alpha" | "alpha-inverted" | "luma" | "luma-inverted" | null;
  repeat?: boolean;
  warp_mode?: "default" | "perspective";
  warp_matrix?: number[] | null;
  animations?: any[] | null;
}

interface TextElementProperties extends CommonElementProperties {
  text: string;
  font_family?: string;
  font_weight?: number;
  font_style?: "normal" | "italic";
  font_size?: RelativeUnit | null;
  font_size_minimum?: RelativeUnit;
  font_size_maximum?: RelativeUnit;
  letter_spacing?: RelativeUnit;
  line_height?: RelativeUnit;
  text_wrap?: boolean;
  text_clip?: boolean;
  text_transform?: "none" | "capitalize" | "uppercase" | "lowercase";
  background_color?: string | null;
  background_x_padding?: RelativeUnit;
  background_y_padding?: RelativeUnit;
  background_border_radius?: RelativeUnit;
  background_align_threshold?: RelativeUnit;
  transcript_source?: string | null;
  transcript_effect?:
    | "color"
    | "karaoke"
    | "highlight"
    | "fade"
    | "bounce"
    | "slide"
    | "enlarge";
  transcript_split?: "none" | "word" | "line";
  transcript_placement?: "static" | "animate" | "align";
  transcript_maximum_length?: number | null;
  transcript_color?: string;
}

interface ImageElementProperties extends CommonElementProperties {
  source: string;
  provider?: string | null;
  fit?: "cover" | "contain" | "fill";
  smart_crop?: boolean;
}

interface VideoElementProperties extends CommonElementProperties {
  source: string;
  provider?: string | null;
  trim_start?: number | null;
  trim_duration?: number | null;
  loop?: boolean;
  volume?: RelativeUnit;
  audio_fade_in?: number | null;
  audio_fade_out?: number | null;
  fit?: "cover" | "contain" | "fill";
}

interface AudioElementProperties extends CommonElementProperties {
  source: string;
  provider?: string | null;
  trim_start?: number | null;
  trim_duration?: number | null;
  loop?: boolean;
  volume?: RelativeUnit;
  audio_fade_in?: number | null;
  audio_fade_out?: number | null;
}

interface ShapeElementProperties extends CommonElementProperties {
  path?: string | null;
}

interface CompositionElementProperties extends CommonElementProperties {
  flow_direction?: "vertical" | "horizontal";
  loop?: boolean;
  plays?: number | null;
}

interface CustomElementProperties extends CommonElementProperties {
  id?: string | null;
  name?: string | null;
  source?: string | null;
  type?: string | null;
}

type ElementProperties =
  | TextElementProperties
  | ImageElementProperties
  | VideoElementProperties
  | AudioElementProperties
  | ShapeElementProperties
  | CompositionElementProperties
  | CustomElementProperties;

export interface DefaultSource {
  name: string;
  coverImage: string;
  layout: "portrait" | "landscape" | "square" | "custom";
  type:
    | "portrait-split"
    | "landscape-split"
    | "blur-vertical"
    | "blur-horizontal"
    | "picture-in-picture"
    | "square";
  data: {
    output_format: "jpg" | "png" | "gif" | "mp4";
    width: number;
    height: number;
    fill_color?: string;
    elements: ElementProperties[];
  };
}
