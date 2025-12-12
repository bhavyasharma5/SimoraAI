// Caption and Video Types for Simora AI

export interface Caption {
  id: string;
  text: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  words?: Word[];
}

export interface Word {
  text: string;
  startTime: number;
  endTime: number;
  confidence?: number;
}

export type CaptionStyle = 'classic' | 'modern' | 'karaoke' | 'news';

export interface CaptionStyleConfig {
  id: CaptionStyle;
  name: string;
  description: string;
  preview: string;
  position: 'bottom' | 'top' | 'center';
  fontSize: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  padding: number;
  borderRadius: number;
  animation?: 'fade' | 'slide' | 'typewriter' | 'karaoke';
}

export interface VideoProject {
  id: string;
  videoUrl: string;
  videoDuration: number;
  videoWidth: number;
  videoHeight: number;
  fps: number;
  captions: Caption[];
  selectedStyle: CaptionStyle;
  createdAt: Date;
  status: 'uploading' | 'processing' | 'ready' | 'rendering' | 'complete' | 'error';
}

export interface TranscriptionResult {
  captions: Caption[];
  language: string;
  duration: number;
}

export interface RenderProgress {
  progress: number;
  currentFrame: number;
  totalFrames: number;
  status: 'idle' | 'rendering' | 'encoding' | 'complete' | 'error';
  outputPath?: string;
  error?: string;
}

