import { CaptionStyle, CaptionStyleConfig } from '@/types';

export const CAPTION_STYLES: Record<CaptionStyle, CaptionStyleConfig> = {
  classic: {
    id: 'classic',
    name: 'Classic Subtitles',
    description: 'Traditional bottom-centered subtitles with semi-transparent background',
    preview: '🎬',
    position: 'bottom',
    fontSize: 32,
    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    textColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    animation: 'fade',
  },
  modern: {
    id: 'modern',
    name: 'Modern Pop',
    description: 'Bold, stylish captions with gradient background and smooth animations',
    preview: '✨',
    position: 'bottom',
    fontSize: 36,
    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
    backgroundColor: 'linear-gradient(135deg, rgba(99, 102, 241, 0.9), rgba(168, 85, 247, 0.9))',
    textColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    animation: 'slide',
  },
  karaoke: {
    id: 'karaoke',
    name: 'Karaoke Style',
    description: 'Word-by-word highlighting as audio plays, perfect for lyrics and songs',
    preview: '🎤',
    position: 'center',
    fontSize: 42,
    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
    backgroundColor: 'transparent',
    textColor: '#FFFFFF',
    padding: 24,
    borderRadius: 0,
    animation: 'karaoke',
  },
  news: {
    id: 'news',
    name: 'News Ticker',
    description: 'Professional news-style captions at the top with a sleek bar design',
    preview: '📺',
    position: 'top',
    fontSize: 28,
    fontFamily: "'Noto Sans', 'Noto Sans Devanagari', sans-serif",
    backgroundColor: 'rgba(220, 38, 38, 0.95)',
    textColor: '#FFFFFF',
    padding: 14,
    borderRadius: 0,
    animation: 'typewriter',
  },
};

export const getCaptionStyle = (style: CaptionStyle): CaptionStyleConfig => {
  return CAPTION_STYLES[style] || CAPTION_STYLES.classic;
};

export const getAllStyles = (): CaptionStyleConfig[] => {
  return Object.values(CAPTION_STYLES);
};

