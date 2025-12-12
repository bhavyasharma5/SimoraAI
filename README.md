# 🎬 Simora AI - Video Captioning Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Remotion-4.0-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/OpenAI-Whisper-green?style=for-the-badge&logo=openai" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
</div>

<div align="center">
  <h3>Auto-generate beautiful captions for your videos with AI 🤖</h3>
  <p>Upload your video, let AI transcribe the audio, and render stunning captions with multiple styles. <br/>Perfect for Hinglish content! 🇮🇳</p>
</div>

---

## ✨ Features

- **🎯 Auto-Caption Generation** - Powered by OpenAI Whisper API with excellent Hindi/Hinglish support
- **🎨 4 Caption Styles** - Classic, Modern Pop, Karaoke, and News Ticker styles
- **🎤 Word-Level Highlighting** - Karaoke-style captions with word-by-word highlighting
- **🌐 Hinglish Support** - Full support for mixed Hindi (Devanagari) and English text
- **📺 Real-time Preview** - Preview captions on your video using Remotion Player
- **📤 Video Export** - Export captioned videos as MP4 using Remotion renderer
- **🎭 Beautiful UI** - Modern, responsive design with smooth animations

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | Full-stack React framework |
| **TypeScript** | Type safety and better DX |
| **Remotion** | Video rendering and preview |
| **OpenAI Whisper** | Speech-to-text transcription |
| **Tailwind CSS** | Styling and responsive design |
| **Framer Motion** | Smooth animations |
| **Noto Sans Devanagari** | Hinglish font support |

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** or **yarn**
- **OpenAI API Key** (for caption generation)
- **FFmpeg** (for video rendering - auto-installed with Remotion)

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/simora-ai.git
cd simora-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
# Copy the example env file
cp env.example .env.local

# Edit .env.local and add your OpenAI API key
OPENAI_API_KEY=sk-your-api-key-here
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Uploading a Video

1. Navigate to the home page
2. Drag and drop your MP4 video or click to browse
3. Preview your video and click "Continue to Captions"

### Generating Captions

1. Click the **"Auto-generate Captions"** button
2. Wait for the AI to transcribe your audio
3. Review and edit captions if needed

### Choosing a Caption Style

Select from 4 beautiful caption styles:

| Style | Description |
|-------|-------------|
| **Classic** | Traditional bottom-centered subtitles with fade animation |
| **Modern Pop** | Bold gradient captions with slide animation |
| **Karaoke** | Word-by-word highlighting in the center |
| **News** | Top-bar ticker style with typewriter effect |

### Exporting Your Video

1. Click the **"Export Video"** button
2. Wait for the rendering to complete
3. Download your captioned video!

## 🎯 Caption Generation Method

### OpenAI Whisper API

This project uses **OpenAI's Whisper API** for speech-to-text transcription:

```typescript
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
  response_format: 'verbose_json',
  timestamp_granularities: ['word', 'segment'],
  language: 'hi', // Supports Hindi/Hinglish
});
```

**Why Whisper?**
- ✅ Excellent accuracy for Hindi and Hinglish content
- ✅ Word-level timestamps for karaoke highlighting
- ✅ Fast processing through cloud API
- ✅ Handles mixed-language audio seamlessly

### Demo Mode

If no API key is configured, the app runs in demo mode with sample Hinglish captions.

## 🖥️ CLI Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Remotion Commands

```bash
npm run remotion:preview  # Open Remotion preview studio
npm run remotion:studio   # Open Remotion studio
npm run remotion:render   # Render video to out/video.mp4
```

### Manual Render with Custom Props

```bash
npx remotion render src/remotion/index.ts CaptionedVideo out/my-video.mp4 \
  --props='{"videoSrc": "/path/to/video.mp4", "captions": [...], "captionStyle": "modern"}'
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

**Note:** Video rendering on serverless platforms has limitations. For production rendering:
- Use the CLI render command locally
- Or set up a dedicated rendering server

### Render.com

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `npm run build`
4. Set start command: `npm run start`
5. Add environment variables

### Netlify

1. Create a new site from Git
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables

## 📁 Project Structure

```
simora-ai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── transcribe/     # Whisper API endpoint
│   │   │   └── render/         # Video rendering endpoint
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page
│   ├── components/
│   │   ├── VideoUploader.tsx   # Video upload UI
│   │   ├── VideoPreview.tsx    # Remotion player
│   │   ├── StyleSelector.tsx   # Caption style picker
│   │   ├── CaptionEditor.tsx   # Edit captions
│   │   └── ExportButton.tsx    # Export functionality
│   ├── remotion/
│   │   ├── CaptionedVideo.tsx  # Main composition
│   │   ├── Root.tsx            # Remotion root
│   │   └── index.ts            # Exports
│   ├── lib/
│   │   ├── caption-styles.ts   # Style definitions
│   │   └── utils.ts            # Utilities
│   └── types/
│       └── index.ts            # TypeScript types
├── public/
│   ├── outputs/                # Rendered videos
│   └── uploads/                # Uploaded files
├── env.example                 # Environment template
├── remotion.config.ts          # Remotion configuration
└── package.json
```

## 🎨 Caption Styles Reference

### Classic Style
```css
Position: Bottom
Background: rgba(0, 0, 0, 0.75)
Animation: Fade
Font Size: 32px
```

### Modern Pop Style
```css
Position: Bottom
Background: Gradient (Purple to Pink)
Animation: Slide
Font Size: 36px
Shadow: Yes
```

### Karaoke Style
```css
Position: Center
Background: Transparent
Animation: Word highlighting
Font Size: 42px
Special: Word-level progress bar
```

### News Style
```css
Position: Top
Background: rgba(220, 38, 38, 0.95)
Animation: Typewriter
Font Size: 28px
```

## 🔧 Configuration

### Whisper API Options

```typescript
// In src/app/api/transcribe/route.ts
const transcription = await openai.audio.transcriptions.create({
  file: audioFile,
  model: 'whisper-1',
  response_format: 'verbose_json',
  timestamp_granularities: ['word', 'segment'],
  language: 'hi',  // Change for different languages
});
```

### Supported Languages
- Hindi (hi) - Default
- English (en)
- Auto-detect (remove language parameter)

## 📝 API Reference

### POST /api/transcribe

Transcribe audio from uploaded video.

**Request:**
```
Content-Type: multipart/form-data
Body: audio file
```

**Response:**
```json
{
  "captions": [...],
  "language": "hi",
  "duration": 30.5
}
```

### POST /api/render

Render video with captions.

**Request:**
```json
{
  "videoUrl": "blob:...",
  "captions": [...],
  "captionStyle": "modern",
  "duration": 30.5
}
```

**Response:**
```json
{
  "success": true,
  "outputPath": "/outputs/uuid.mp4"
}
```

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for any purpose.

## 🙏 Acknowledgments

- [Remotion](https://remotion.dev) - Programmatic video creation
- [OpenAI Whisper](https://openai.com/whisper) - Speech recognition
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS

---

<div align="center">
  <p>Built with ❤️ by Simora AI</p>
  <p>🇮🇳 Made for Hinglish Content Creators</p>
</div>
