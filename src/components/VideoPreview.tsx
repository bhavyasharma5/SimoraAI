'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { Caption, CaptionStyle } from '@/types';
import { cn, formatTime } from '@/lib/utils';
import { getCaptionStyle } from '@/lib/caption-styles';

interface VideoPreviewProps {
  videoUrl: string;
  captions: Caption[];
  captionStyle: CaptionStyle;
  duration: number;
  fps?: number;
  onTimeUpdate?: (time: number) => void;
  seekTo?: number;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUrl,
  captions,
  captionStyle,
  duration,
  fps = 30,
  onTimeUpdate,
  seekTo,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle seek
  useEffect(() => {
    if (seekTo !== undefined && videoRef.current) {
      videoRef.current.currentTime = seekTo;
      setCurrentTime(seekTo);
    }
  }, [seekTo]);

  // Update time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [onTimeUpdate]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const restart = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const progress = (currentTime / duration) * 100;

  // Get active caption
  const activeCaption = captions.find(
    (cap) => currentTime >= cap.startTime && currentTime <= cap.endTime
  );

  return (
    <div ref={containerRef} className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
      >
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            playsInline
            preload="metadata"
          />

          {/* Caption Overlay */}
          {activeCaption && (
            <CaptionOverlay
              caption={activeCaption}
              captionStyle={captionStyle}
              currentTime={currentTime}
            />
          )}

          {/* Play/Pause Overlay */}
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer group"
            onClick={togglePlay}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isPlaying ? 0 : 1 }}
              className="bg-black/40 backdrop-blur-sm rounded-full p-6 group-hover:bg-black/60 transition-colors"
            >
              <Play className="w-12 h-12 text-white ml-1" fill="white" />
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-16">
          {/* Progress Bar */}
          <div className="relative group mb-4">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {/* Time Tooltip */}
            <div
              className="absolute -top-8 transform -translate-x-1/2 px-2 py-1 rounded bg-slate-800 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ left: `${progress}%` }}
            >
              {formatTime(currentTime)}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                onClick={togglePlay}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white" fill="white" />
                )}
              </motion.button>

              <motion.button
                onClick={restart}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-5 h-5 text-white" />
              </motion.button>

              <motion.button
                onClick={toggleMute}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-white" />
                ) : (
                  <Volume2 className="w-5 h-5 text-white" />
                )}
              </motion.button>

              <span className="text-white/80 text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                onClick={toggleFullscreen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              >
                <Maximize2 className="w-5 h-5 text-white" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Caption Overlay Component
interface CaptionOverlayProps {
  caption: Caption;
  captionStyle: CaptionStyle;
  currentTime: number;
}

const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  caption,
  captionStyle,
  currentTime,
}) => {
  const styleConfig = getCaptionStyle(captionStyle);

  const getPositionStyles = (): React.CSSProperties => {
    switch (styleConfig.position) {
      case 'top':
        return { top: 40, left: 0, right: 0 };
      case 'center':
        return { top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' };
      case 'bottom':
      default:
        return { bottom: 80, left: 0, right: 0 };
    }
  };

  // Karaoke style with word-level highlighting
  if (captionStyle === 'karaoke' && caption.words && caption.words.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: styleConfig.padding,
          pointerEvents: 'none',
          ...getPositionStyles(),
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '8px',
            maxWidth: '80%',
            textShadow: '2px 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          {caption.words.map((word, index) => {
            const isActive = currentTime >= word.startTime && currentTime <= word.endTime;
            const isPast = currentTime > word.endTime;

            return (
              <span
                key={index}
                style={{
                  fontSize: styleConfig.fontSize,
                  fontFamily: styleConfig.fontFamily,
                  fontWeight: 700,
                  color: isPast || isActive ? '#FBBF24' : '#FFFFFF',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.2s ease',
                  display: 'inline-block',
                  position: 'relative',
                }}
              >
                {word.text}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '100%',
                      height: 3,
                      background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
                      borderRadius: 2,
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Standard caption styles
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 40px',
        pointerEvents: 'none',
        ...getPositionStyles(),
      }}
    >
      <div
        style={{
          background: styleConfig.backgroundColor,
          color: styleConfig.textColor,
          fontSize: styleConfig.fontSize,
          fontFamily: styleConfig.fontFamily,
          padding: `${styleConfig.padding}px ${styleConfig.padding * 1.5}px`,
          borderRadius: styleConfig.borderRadius,
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.4,
          fontWeight: 600,
          textShadow: captionStyle === 'modern' ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
          boxShadow: captionStyle === 'modern' ? '0 10px 40px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {caption.text}
      </div>
    </motion.div>
  );
};
