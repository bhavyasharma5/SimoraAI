# Sample Files

This folder contains sample caption files for testing and demonstration purposes.

## Files

### `captions.json`
A JSON file containing sample Hinglish captions with word-level timestamps. This format is used internally by Simora AI for karaoke-style highlighting.

### `captions.srt`
An SRT (SubRip) format file containing the same captions. This is a standard subtitle format compatible with most video players.

## Caption Content

The sample captions demonstrate Hinglish (Hindi + English) text rendering:

1. **नमस्ते! Welcome to Simora AI** (0:00 - 0:03)
2. **This is a demo of Hinglish captions** (0:03.5 - 0:06)
3. **आप किसी भी style को choose कर सकते हैं** (0:06.5 - 0:10)
4. **Export your video with beautiful captions!** (0:10.5 - 0:14)

## Usage

### Using with Remotion CLI

```bash
# Render a video with these captions
npx remotion render src/remotion/index.ts CaptionedVideo out/sample.mp4 \
  --props="$(cat sample/captions.json | jq -c '{videoSrc: "/path/to/video.mp4", captions: .captions, captionStyle: "modern"}')"
```

### Testing in the App

1. Upload any MP4 video to the Simora AI web interface
2. Instead of auto-generating, you can manually add these captions
3. Select your preferred style (Classic, Modern, Karaoke, News)
4. Preview and export!

## Output Sample

A sample output video will be generated and linked here after rendering.

> **Note:** To generate a sample output, you need a source video file. Use any MP4 video and run the Remotion CLI render command.

