# 🎬 Video Rendering Guide

This guide explains how to render your captioned videos locally.

## Quick Start

### 1. Export from Web App

1. Open the app at https://simora-ai.vercel.app (or localhost:3001)
2. Upload your video and generate captions
3. Click **"Export Video"** button
4. Download both:
   - `captions.json` (for Remotion rendering)
   - `captions.srt` (optional, for other video editors)

### 2. Setup Local Environment

```bash
# Clone the repository
git clone https://github.com/bhavyasharma5/SimoraAI.git
cd SimoraAI

# Install dependencies
npm install
```

### 3. Prepare Your Files

```bash
# Place your video file in the project root
# (Or update the videoSrc path in captions.json)
cp /path/to/your/video.mp4 ./your-video.mp4

# Place the downloaded captions.json in the project root
cp ~/Downloads/captions.json ./
```

### 4. Render Your Video

**Option A: Using the script**
```bash
./render-example.sh
```

**Option B: Manual command**
```bash
npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=captions.json
```

Your rendered video will be saved as `output.mp4`!

## Requirements

### FFmpeg (Required)

Remotion needs FFmpeg for video rendering.

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from https://ffmpeg.org/download.html

### Node.js 18+

Make sure you have Node.js 18 or higher installed:
```bash
node --version
```

## captions.json Format

The exported `captions.json` should look like this:

```json
{
  "videoSrc": "./your-video.mp4",
  "captions": [
    {
      "id": "caption-1",
      "text": "Hello world",
      "startTime": 0,
      "endTime": 2.5
    },
    {
      "id": "caption-2",
      "text": "नमस्ते दुनिया",
      "startTime": 2.5,
      "endTime": 5.0
    }
  ],
  "captionStyle": "classic",
  "durationInFrames": 300
}
```

## Customization

### Change Output Settings

```bash
# Custom output filename
npx remotion render src/remotion/index.ts CaptionedVideo my-video.mp4 --props=captions.json

# Higher quality
npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=captions.json --quality=100

# Different resolution
npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=captions.json --width=1280 --height=720
```

### Caption Styles

Available styles: `classic`, `modern`, `minimal`

Edit `captionStyle` in your `captions.json`:
```json
{
  "captionStyle": "modern"
}
```

## Troubleshooting

### "Cannot find module" error
```bash
npm install
```

### "FFmpeg not found"
Install FFmpeg (see Requirements section above)

### "Video file not found"
Update the `videoSrc` path in `captions.json` to match your video location:
```json
{
  "videoSrc": "./my-actual-video.mp4"
}
```

### Slow rendering
Remotion renders frame-by-frame for maximum quality. A 30-second video might take 1-2 minutes to render.

## Advanced Options

### Render Only a Portion
```bash
npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=captions.json --frames=0-150
```

### Preview Before Rendering
```bash
npx remotion preview src/remotion/index.ts
```

This opens a browser with a live preview of your composition!

## Using SRT with Other Editors

If you prefer to use traditional video editors, use the `captions.srt` file:

- **DaVinci Resolve**: File → Import → Subtitle
- **Adobe Premiere Pro**: File → Import → Captions
- **Final Cut Pro**: File → Import → Captions

## Need Help?

- Remotion Docs: https://www.remotion.dev/docs
- Issues: https://github.com/bhavyasharma5/SimoraAI/issues

