'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Player, PlayerRef } from '@remotion/player';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { CaptionedVideo } from '@/remotion/CaptionedVideo';
import { Caption, CaptionStyle } from '@/types';
import { cn, formatTime } from '@/lib/utils';

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
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const durationInFrames = Math.max(Math.ceil(duration * fps), 1);

  useEffect(() => {
    if (seekTo !== undefined && playerRef.current) {
      const frame = Math.floor(seekTo * fps);
      playerRef.current.seekTo(frame);
      setCurrentTime(seekTo);
    }
  }, [seekTo, fps]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        const frame = playerRef.current.getCurrentFrame();
        const time = frame / fps;
        setCurrentTime(time);
        onTimeUpdate?.(time);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [fps, onTimeUpdate]);

  const togglePlay = useCallback(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pause();
      } else {
        playerRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const frame = parseInt(e.target.value);
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      setCurrentTime(frame / fps);
    }
  }, [fps]);

  const restart = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(0);
      setCurrentTime(0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
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

  return (
    <div ref={containerRef} className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden bg-black shadow-2xl"
      >
        {/* Player Container */}
        <div className="relative aspect-video">
          <Player
            ref={playerRef}
            component={CaptionedVideo}
            inputProps={{
              videoSrc: videoUrl,
              captions,
              captionStyle,
            }}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={1920}
            compositionHeight={1080}
            style={{
              width: '100%',
              height: '100%',
            }}
            controls={false}
            loop={false}
            autoPlay={false}
          />

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
              max={durationInFrames}
              value={Math.floor(currentTime * fps)}
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

