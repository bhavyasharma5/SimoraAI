'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Check, X, Sparkles, Terminal } from 'lucide-react';
import { Caption, CaptionStyle } from '@/types';
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
  const [showModal, setShowModal] = useState(false);

  const handleExport = () => {
    setShowModal(true);
  };

  const cliCommand = `npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 \\
  --props='${JSON.stringify({
    videoSrc: videoUrl,
    captions,
    captionStyle,
    durationInFrames: Math.ceil(duration * 30),
  }).replace(/'/g, "\\'")}'`;

  return (
    <>
      <motion.button
        onClick={handleExport}
        disabled={disabled}
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
        <Download className="w-5 h-5" />
        Export Video
      </motion.button>

      {/* Export Instructions Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-slate-900 rounded-3xl p-8 border border-slate-700 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-400/30">
                    <Terminal className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Export Video</h3>
                    <p className="text-slate-400 text-sm">Render locally with CLI</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 mb-6">
                  <p className="text-blue-300 text-sm leading-relaxed">
                    <strong>Note:</strong> Video rendering requires FFmpeg and isn't available on serverless platforms. 
                    Use the CLI command below to render locally on your machine.
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <h4 className="font-semibold text-white">Clone the repository</h4>
                  </div>
                  <div className="ml-8 p-3 rounded-lg bg-slate-800 font-mono text-sm text-green-400 overflow-x-auto">
                    git clone https://github.com/bhavyasharma5/SimoraAI.git
                    <br />
                    cd SimoraAI
                    <br />
                    npm install
                  </div>
                </div>

                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h4 className="font-semibold text-white">Save your video and captions</h4>
                  </div>
                  <div className="ml-8 text-slate-300 text-sm">
                    <p className="mb-2">Place your video in the project folder and create a <code className="px-2 py-1 rounded bg-slate-800 text-amber-400">props.json</code> file:</p>
                    <div className="p-3 rounded-lg bg-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                      {JSON.stringify({
                        videoSrc: './your-video.mp4',
                        captions: captions.slice(0, 2),
                        captionStyle,
                        durationInFrames: Math.ceil(duration * 30),
                      }, null, 2)}
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-white">Run the render command</h4>
                  </div>
                  <div className="ml-8">
                    <div className="p-3 rounded-lg bg-slate-800 font-mono text-sm text-green-400 overflow-x-auto">
                      npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=props.json
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=props.json');
                      }}
                      className="mt-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
                    >
                      📋 Copy Command
                    </button>
                  </div>
                </div>

                {/* Output */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-400/10 to-emerald-500/10 border border-green-400/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    <h4 className="font-semibold text-green-300">Your captioned video will be saved as:</h4>
                  </div>
                  <p className="text-green-400 font-mono text-sm ml-7">output.mp4</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <motion.button
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl bg-amber-400 text-slate-900 font-semibold"
                >
                  Got it!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
