'use client';

import React from 'react';
import {
  AbsoluteFill,
  Video,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  staticFile,
} from 'remotion';
import { Caption, CaptionStyle, Word } from '../types';
import { getCaptionStyle } from '../lib/caption-styles';

interface CaptionedVideoProps {
  videoSrc: string;
  captions: Caption[];
  captionStyle: CaptionStyle;
}

export const CaptionedVideo: React.FC<CaptionedVideoProps> = ({
  videoSrc,
  captions,
  captionStyle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  const style = getCaptionStyle(captionStyle);
  const activeCaption = captions.find(
    (cap) => currentTime >= cap.startTime && currentTime <= cap.endTime
  );

  return (
    <AbsoluteFill>
      <Video src={staticFile(videoSrc)} />
      {activeCaption && (
        <CaptionOverlay
          caption={activeCaption}
          style={captionStyle}
          currentTime={currentTime}
          fps={fps}
          frame={frame}
        />
      )}
    </AbsoluteFill>
  );
};

interface CaptionOverlayProps {
  caption: Caption;
  style: CaptionStyle;
  currentTime: number;
  fps: number;
  frame: number;
}

const CaptionOverlay: React.FC<CaptionOverlayProps> = ({
  caption,
  style,
  currentTime,
  fps,
  frame,
}) => {
  const styleConfig = getCaptionStyle(style);
  const captionProgress = (currentTime - caption.startTime) / (caption.endTime - caption.startTime);

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

  const getAnimationStyles = (): React.CSSProperties => {
    const startFrame = caption.startTime * fps;
    const endFrame = caption.endTime * fps;
    const captionDuration = endFrame - startFrame;

    switch (styleConfig.animation) {
      case 'fade': {
        const fadeIn = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const fadeOut = interpolate(frame, [endFrame - 10, endFrame], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return { opacity: Math.min(fadeIn, fadeOut) };
      }
      case 'slide': {
        const slideProgress = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 200, stiffness: 100 },
        });
        const slideOut = spring({
          frame: frame - (endFrame - 15),
          fps,
          config: { damping: 200, stiffness: 100 },
        });
        const translateY = interpolate(slideProgress, [0, 1], [50, 0]);
        const translateYOut = frame > endFrame - 15 ? interpolate(slideOut, [0, 1], [0, -50]) : 0;
        return { transform: `translateY(${translateY + translateYOut}px)` };
      }
      case 'typewriter': {
        const progress = interpolate(frame, [startFrame, startFrame + 30], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        return { clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` };
      }
      default:
        return {};
    }
  };

  // Karaoke style with word-level highlighting
  if (style === 'karaoke' && caption.words && caption.words.length > 0) {
    return (
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: styleConfig.padding,
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
          {caption.words.map((word, index) => (
            <KaraokeWord
              key={index}
              word={word}
              currentTime={currentTime}
              fontSize={styleConfig.fontSize}
              fontFamily={styleConfig.fontFamily}
            />
          ))}
        </div>
      </div>
    );
  }

  // Standard caption styles
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        padding: '0 40px',
        ...getPositionStyles(),
        ...getAnimationStyles(),
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
          textShadow: style === 'modern' ? '0 2px 10px rgba(0,0,0,0.3)' : 'none',
          boxShadow: style === 'modern' ? '0 10px 40px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        {caption.text}
      </div>
    </div>
  );
};

interface KaraokeWordProps {
  word: Word;
  currentTime: number;
  fontSize: number;
  fontFamily: string;
}

const KaraokeWord: React.FC<KaraokeWordProps> = ({
  word,
  currentTime,
  fontSize,
  fontFamily,
}) => {
  const isActive = currentTime >= word.startTime && currentTime <= word.endTime;
  const isPast = currentTime > word.endTime;
  const progress = isActive
    ? (currentTime - word.startTime) / (word.endTime - word.startTime)
    : isPast
    ? 1
    : 0;

  return (
    <span
      style={{
        fontSize,
        fontFamily,
        fontWeight: 700,
        color: isPast || isActive ? '#FBBF24' : '#FFFFFF',
        transform: isActive ? 'scale(1.15)' : 'scale(1)',
        transition: 'transform 0.1s ease',
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
            width: `${progress * 100}%`,
            height: 3,
            background: 'linear-gradient(90deg, #FBBF24, #F59E0B)',
            borderRadius: 2,
          }}
        />
      )}
    </span>
  );
};

// Composition wrapper for Remotion
export const CaptionedVideoComposition: React.FC<{
  videoSrc: string;
  captions: Caption[];
  captionStyle: CaptionStyle;
  durationInFrames: number;
}> = ({ videoSrc, captions, captionStyle }) => {
  return (
    <CaptionedVideo
      videoSrc={videoSrc}
      captions={captions}
      captionStyle={captionStyle}
    />
  );
};

