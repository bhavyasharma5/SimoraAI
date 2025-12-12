'use client';

import React from 'react';
import { Composition } from 'remotion';
import { CaptionedVideoComposition } from './CaptionedVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CaptionedVideo"
        component={CaptionedVideoComposition}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoSrc: '',
          captions: [],
          captionStyle: 'classic' as const,
          durationInFrames: 300,
        }}
      />
    </>
  );
};

