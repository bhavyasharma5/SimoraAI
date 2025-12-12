#!/bin/bash

# Simora AI - Video Rendering Script
# Make sure you've:
# 1. Downloaded captions.json from the export modal
# 2. Placed your video file in this directory
# 3. Installed dependencies with: npm install

echo "🎬 Rendering your captioned video..."
echo ""

# Check if captions.json exists
if [ ! -f "captions.json" ]; then
    echo "❌ Error: captions.json not found!"
    echo "Please download it from the export modal first."
    exit 1
fi

# Render the video
npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=captions.json

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your video is ready: output.mp4"
    echo ""
else
    echo ""
    echo "❌ Rendering failed. Make sure:"
    echo "   - FFmpeg is installed"
    echo "   - Your video file path in captions.json is correct"
    echo "   - All dependencies are installed (npm install)"
    echo ""
fi

