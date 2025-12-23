
export enum GenerationType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  EDIT = 'EDIT',
  ANALYZE = 'ANALYZE'
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'text';
  url: string;
  prompt: string;
  timestamp: number;
  metadata?: any;
}

export type AspectRatio = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";
export type ImageSize = "1K" | "2K" | "4K";
export type VideoResolution = "720p" | "1080p";

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  videoResolution: VideoResolution;
  style?: string;
}
