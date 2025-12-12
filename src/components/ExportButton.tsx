'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Check, X, Sparkles } from 'lucide-react';
import { Caption, CaptionStyle, RenderProgress } from '@/types';
import { cn } from '@/lib/utils';

interface ExportButtonProps {
  videoUrl: string;
  captions: Caption[];
  captionStyle: CaptionStyle;
  duration: number;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  videoUrl,
  captions,
  captionStyle,
  duration,
  disabled,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<RenderProgress | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setShowModal(true);
    setProgress({
      progress: 0,
      currentFrame: 0,
      totalFrames: Math.ceil(duration * 30),
      status: 'rendering',
    });

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoUrl,
          captions,
          captionStyle,
          duration,
        }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Simulate progress for demo (in real implementation, use SSE or WebSocket)
      for (let i = 0; i <= 100; i += 5) {
        await new Promise((r) => setTimeout(r, 200));
        setProgress({
          progress: i,
          currentFrame: Math.floor((i / 100) * duration * 30),
          totalFrames: Math.ceil(duration * 30),
          status: i < 100 ? 'rendering' : 'complete',
        });
      }

      const result = await response.json();
      
      setProgress({
        progress: 100,
        currentFrame: Math.ceil(duration * 30),
        totalFrames: Math.ceil(duration * 30),
        status: 'complete',
        outputPath: result.outputPath,
      });

      // Download the file
      if (result.outputPath) {
        const link = document.createElement('a');
        link.href = result.outputPath;
        link.download = 'captioned-video.mp4';
        link.click();
      }
    } catch (error) {
      console.error('Export error:', error);
      setProgress({
        progress: 0,
        currentFrame: 0,
        totalFrames: 0,
        status: 'error',
        error: 'Failed to export video. Please try again.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <motion.button
        onClick={handleExport}
        disabled={disabled || isExporting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300',
          'bg-gradient-to-r from-green-400 to-emerald-500 text-slate-900',
          'hover:shadow-lg hover:shadow-green-500/25',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-3'
        )}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            Export Video
          </>
        )}
      </motion.button>

      {/* Export Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-slate-900 rounded-3xl p-8 border border-slate-700"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                {progress?.status === 'rendering' && (
                  <>
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-slate-700"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="44"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={276.46}
                          strokeDashoffset={276.46 * (1 - (progress.progress || 0) / 100)}
                          className="transition-all duration-300"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#34D399" />
                            <stop offset="100%" stopColor="#10B981" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {Math.round(progress.progress || 0)}%
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Rendering your video
                    </h3>
                    <p className="text-slate-400">
                      Frame {progress.currentFrame} of {progress.totalFrames}
                    </p>
                  </>
                )}

                {progress?.status === 'complete' && (
                  <>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-12 h-12 text-slate-900" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Export Complete!
                    </h3>
                    <p className="text-slate-400 mb-6">
                      Your video has been exported successfully.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-500 text-slate-900 font-semibold cursor-pointer"
                      onClick={() => setShowModal(false)}
                    >
                      <Sparkles className="w-5 h-5" />
                      Done
                    </motion.div>
                  </>
                )}

                {progress?.status === 'error' && (
                  <>
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                      <X className="w-12 h-12 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Export Failed
                    </h3>
                    <p className="text-slate-400 mb-6">
                      {progress.error || 'An error occurred during export.'}
                    </p>
                    <motion.button
                      onClick={handleExport}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-semibold"
                    >
                      Try Again
                    </motion.button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

