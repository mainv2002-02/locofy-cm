export interface FigmaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface FigmaFontStyle {
  fontFamily?: string;
  fontPostScriptName?: string;
  fontSize?: number;
  fontWeight?: number;
  textAutoResize?: string;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  letterSpacing?: number;
  lineHeightPx?: number;
  lineHeightPercent?: number;
  lineHeightUnit?: string;
}

export interface FigmaProperties {
  absoluteBoundingBox?: { x: number; y: number; width: number; height: number };
  fills?: FigmaColor[];
  strokes?: FigmaColor[];
  effects?: any[]; // Adjust as needed for specific effect types
  text_content?: string;
  font_style?: FigmaFontStyle;
}

export interface FigmaElement {
  id: string;
  name?: string;
  type: string;
  properties: FigmaProperties;
  componentId?: string;
  description?: string;
  file_id: string;
}

export interface FigmaFile {
  id: string;
  name: string;
  image_url?: string;
  upload_timestamp: string; // Date string
}
