// src/utils/creatomate/font-types.ts
export interface FontStyle {
  id: number;
  preview_image: string;
  styles: {
    fill_color?: string;
    font_family?: string;
    font_weight?: string | number;
    stroke_color?: string;
    font_size?: string;
    stroke?: string;
    stroke_width?: string;
    text_shadow?: string;
    text_align?: string;
    text_transform?: string;
    font_style?: string;
    line_height?: string;
    x?: string;
    y?: string;
    width?: string;
    height?: string;
    x_alignment?: string;
    y_alignment?: string;
    text?: string;
    font_size_minimum?: string;
    font_size_maximum?: string;
    letter_spacing?: string;
    text_wrap?: boolean;
    text_clip?: boolean;
    background_color?: string;
    background_x_padding?: string;
    background_y_padding?: string;
    background_border_radius?: string;
    background_align_threshold?: string;
  };
}
