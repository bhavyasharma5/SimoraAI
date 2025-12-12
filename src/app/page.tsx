'use client';

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Loader2, ArrowLeft, Sparkles, Github, ExternalLink } from 'lucide-react';
import {
  VideoUploader,
  StyleSelector,
  CaptionEditor,
  VideoPreview,
  ExportButton,
} from '@/components';
import { Caption, CaptionStyle } from '@/types';
import { cn } from '@/lib/utils';

type AppStep = 'upload' | 'editor';

export default function Home() {
  const [step, setStep] = useState<AppStep>('upload');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('classic');
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoUpload = useCallback(async (file: File, url: string) => {
    setIsUploading(true);
    setVideoFile(file);
    setVideoUrl(url);

    // Get video duration
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      setVideoDuration(video.duration);
      setIsUploading(false);
      setStep('editor');
    };
  }, []);

  const handleAutoGenerate = useCallback(async () => {
    if (!videoFile) return;

    setIsTranscribing(true);

    try {
      // Extract audio from video and send for transcription
      const formData = new FormData();
      formData.append('audio', videoFile);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      setCaptions(data.captions);
    } catch (error) {
      console.error('Auto-generate error:', error);
      // Use demo captions on error
      setCaptions(getDemoCaptions());
    } finally {
      setIsTranscribing(false);
    }
  }, [videoFile]);

  const handleSeek = useCallback((time: number) => {
    setSeekTime(time);
    setTimeout(() => setSeekTime(undefined), 100);
  }, []);

  const handleBack = useCallback(() => {
    setStep('upload');
    setVideoFile(null);
    setVideoUrl('');
    setCaptions([]);
    setVideoDuration(0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 rounded-full blur-[200px]" />
      </div>

      {/* Grid Pattern */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 backdrop-blur-xl bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step === 'editor' && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleBack}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl blur-md opacity-50" />
                  <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-2 rounded-xl">
                    <Sparkles className="w-6 h-6 text-slate-900" />
                  </div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                  Simora AI
                </span>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-sm"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://remotion.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Remotion</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
            >
              <div className="text-center mb-12">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
                >
                  <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                    Auto-generate
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                    Beautiful Captions
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-lg text-slate-400 max-w-2xl mx-auto"
                >
                  Upload your video, let AI transcribe the audio, and render
                  stunning captions with multiple styles. Perfect for Hinglish content! 🇮🇳
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-3 mt-8"
                >
                  {['Whisper AI', 'Hinglish Support', '4 Caption Styles', 'Real-time Preview'].map(
                    (feature, i) => (
                      <span
                        key={feature}
                        className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm text-slate-300"
                      >
                        {feature}
                      </span>
                    )
                  )}
                </motion.div>
              </div>

              <VideoUploader onVideoUpload={handleVideoUpload} isUploading={isUploading} />

              {/* How it works */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {[
                  { icon: '📤', title: 'Upload', desc: 'Drop your MP4 video file' },
                  { icon: '🎯', title: 'Generate', desc: 'AI transcribes your audio' },
                  { icon: '🎬', title: 'Export', desc: 'Download with captions' },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800"
                  >
                    <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 font-bold text-sm">
                      {i + 1}
                    </div>
                    <span className="text-3xl block mb-3">{item.icon}</span>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {step === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Preview Column */}
                <div className="lg:col-span-2 space-y-6">
                  <VideoPreview
                    videoUrl={videoUrl}
                    captions={captions}
                    captionStyle={captionStyle}
                    duration={videoDuration}
                    onTimeUpdate={setCurrentTime}
                    seekTo={seekTime}
                  />

                  {/* Auto-generate Button */}
                  <motion.button
                    onClick={handleAutoGenerate}
                    disabled={isTranscribing}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      'w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300',
                      'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900',
                      'hover:shadow-lg hover:shadow-amber-500/25',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      'flex items-center justify-center gap-3'
                    )}
                  >
                    {isTranscribing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating captions...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        Auto-generate Captions
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Style Selector */}
                  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <StyleSelector
                      selectedStyle={captionStyle}
                      onStyleChange={setCaptionStyle}
                    />
                  </div>

                  {/* Caption Editor */}
                  <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
                    <CaptionEditor
                      captions={captions}
                      onCaptionsChange={setCaptions}
                      currentTime={currentTime}
                      onSeek={handleSeek}
                    />
                  </div>

                  {/* Export Button */}
                  <ExportButton
                    videoUrl={videoUrl}
                    captions={captions}
                    captionStyle={captionStyle}
                    duration={videoDuration}
                    disabled={captions.length === 0}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              Built with ❤️ using Next.js, Remotion & OpenAI Whisper
            </p>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">
                Hinglish Ready 🇮🇳
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-500 text-sm">
                © 2024 Simora AI
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Demo captions for testing
function getDemoCaptions(): Caption[] {
  return [
    {
      id: '1',
      text: 'नमस्ते! Welcome to Simora AI',
      startTime: 0,
      endTime: 3,
      words: [
        { text: 'नमस्ते!', startTime: 0, endTime: 1 },
        { text: 'Welcome', startTime: 1.2, endTime: 1.8 },
        { text: 'to', startTime: 1.9, endTime: 2.1 },
        { text: 'Simora', startTime: 2.2, endTime: 2.6 },
        { text: 'AI', startTime: 2.7, endTime: 3 },
      ],
    },
    {
      id: '2',
      text: 'This is a demo of Hinglish captions',
      startTime: 3.5,
      endTime: 6,
      words: [
        { text: 'This', startTime: 3.5, endTime: 3.8 },
        { text: 'is', startTime: 3.9, endTime: 4.1 },
        { text: 'a', startTime: 4.2, endTime: 4.3 },
        { text: 'demo', startTime: 4.4, endTime: 4.8 },
        { text: 'of', startTime: 4.9, endTime: 5.1 },
        { text: 'Hinglish', startTime: 5.2, endTime: 5.6 },
        { text: 'captions', startTime: 5.7, endTime: 6 },
      ],
    },
    {
      id: '3',
      text: 'आप किसी भी style को choose कर सकते हैं',
      startTime: 6.5,
      endTime: 10,
      words: [
        { text: 'आप', startTime: 6.5, endTime: 6.8 },
        { text: 'किसी', startTime: 6.9, endTime: 7.2 },
        { text: 'भी', startTime: 7.3, endTime: 7.5 },
        { text: 'style', startTime: 7.6, endTime: 8 },
        { text: 'को', startTime: 8.1, endTime: 8.3 },
        { text: 'choose', startTime: 8.4, endTime: 8.8 },
        { text: 'कर', startTime: 8.9, endTime: 9.2 },
        { text: 'सकते', startTime: 9.3, endTime: 9.6 },
        { text: 'हैं', startTime: 9.7, endTime: 10 },
      ],
    },
    {
      id: '4',
      text: 'Export your video with beautiful captions!',
      startTime: 10.5,
      endTime: 14,
      words: [
        { text: 'Export', startTime: 10.5, endTime: 11 },
        { text: 'your', startTime: 11.1, endTime: 11.4 },
        { text: 'video', startTime: 11.5, endTime: 11.9 },
        { text: 'with', startTime: 12, endTime: 12.3 },
        { text: 'beautiful', startTime: 12.4, endTime: 13 },
        { text: 'captions!', startTime: 13.1, endTime: 14 },
      ],
    },
  ];
}
