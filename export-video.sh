#!/bin/bash

# Simora AI - Easy Video Export Script
# Usage: ./export-video.sh <video-file> <captions.json> [output-name]

echo "🎬 Simora AI - Video Export"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check arguments
if [ $# -lt 2 ]; then
    echo "❌ Usage: ./export-video.sh <video-file> <captions.json> [output-name]"
    echo ""
    echo "Example:"
    echo "  ./export-video.sh ~/Downloads/my-video.mp4 ~/Downloads/captions.json my-output"
    exit 1
fi

VIDEO_FILE="$1"
CAPTIONS_FILE="$2"
OUTPUT_NAME="${3:-output}"

# Check if files exist
if [ ! -f "$VIDEO_FILE" ]; then
    echo "❌ Video file not found: $VIDEO_FILE"
    exit 1
fi

if [ ! -f "$CAPTIONS_FILE" ]; then
    echo "❌ Captions file not found: $CAPTIONS_FILE"
    exit 1
fi

echo "📹 Video: $VIDEO_FILE"
echo "📝 Captions: $CAPTIONS_FILE"
echo "💾 Output: ${OUTPUT_NAME}.mp4"
echo ""

# Copy video to public folder
VIDEO_FILENAME=$(basename "$VIDEO_FILE")
echo "📦 Copying video to public folder..."
cp "$VIDEO_FILE" "public/$VIDEO_FILENAME"

# Update captions.json with video filename
echo "⚙️  Updating captions with video source..."
TMP_CAPTIONS=$(mktemp)
jq --arg src "$VIDEO_FILENAME" '.videoSrc = $src' "$CAPTIONS_FILE" > "$TMP_CAPTIONS"
mv "$TMP_CAPTIONS" props.json

echo "🎨 Rendering video with captions..."
echo ""

# Render with Remotion
npx remotion render src/remotion/index.ts CaptionedVideo "${OUTPUT_NAME}.mp4" --props=props.json

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your video is ready:"
    echo "   📁 $(pwd)/${OUTPUT_NAME}.mp4"
    echo ""
    ls -lh "${OUTPUT_NAME}.mp4"
else
    echo ""
    echo "❌ Rendering failed. Please check the errors above."
    exit 1
fi

