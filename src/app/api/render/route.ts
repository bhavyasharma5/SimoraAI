import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const { videoUrl, captions, captionStyle, duration } = await request.json();

    if (!videoUrl || !captions) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const outputId = uuidv4();
    
    // For serverless deployments (Vercel, Netlify), we return CLI instructions
    // since native video rendering is not supported in serverless environments
    const isServerless = process.env.VERCEL || process.env.NETLIFY || process.env.NODE_ENV === 'production';
    
    if (isServerless) {
      // Generate CLI command for local rendering
      const props = JSON.stringify({
        videoSrc: videoUrl,
        captions,
        captionStyle,
        durationInFrames: Math.ceil(duration * 30),
      });

      return NextResponse.json({
        success: true,
        message: 'Video export prepared. Use the CLI command below for rendering.',
        instructions: `
To render the video locally, run:
npx remotion render src/remotion/index.ts CaptionedVideo out/${outputId}.mp4 --props='${props}'

Or download the project and render locally for full video export functionality.
        `.trim(),
        outputId,
        props: {
          videoSrc: videoUrl,
          captions,
          captionStyle,
          durationInFrames: Math.ceil(duration * 30),
        },
      });
    }

    // Local development - attempt dynamic import of renderer
    try {
      const { bundle } = await import('@remotion/bundler');
      const { renderMedia, selectComposition } = await import('@remotion/renderer');
      const path = await import('path');
      const fs = await import('fs');
      
      const outputPath = path.join(process.cwd(), 'public', 'outputs', `${outputId}.mp4`);
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const bundleLocation = await bundle({
        entryPoint: path.resolve('./src/remotion/index.ts'),
        webpackOverride: (config) => config,
      });

      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'CaptionedVideo',
        inputProps: {
          videoSrc: videoUrl,
          captions,
          captionStyle,
          durationInFrames: Math.ceil(duration * 30),
        },
      });

      await renderMedia({
        composition: {
          ...composition,
          durationInFrames: Math.ceil(duration * 30),
        },
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: {
          videoSrc: videoUrl,
          captions,
          captionStyle,
          durationInFrames: Math.ceil(duration * 30),
        },
      });

      return NextResponse.json({
        success: true,
        outputPath: `/outputs/${outputId}.mp4`,
      });
    } catch (renderError) {
      console.error('Local render error:', renderError);
      
      // Fallback: return CLI instructions
      return NextResponse.json({
        success: true,
        message: 'Rendering not available in this environment. Use CLI for video export.',
        outputId,
        fallback: true,
      });
    }
  } catch (error) {
    console.error('Render API error:', error);
    return NextResponse.json(
      { error: 'Failed to process render request' },
      { status: 500 }
    );
  }
}
