'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, Check, X, Sparkles, Terminal, FileJson, FileText } from 'lucide-react';
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

  const downloadCaptionsJSON = () => {
    const data = {
      videoSrc: './your-video.mp4',
      captions,
      captionStyle,
      durationInFrames: Math.ceil(duration * 30),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCaptionsSRT = () => {
    let srt = '';
    captions.forEach((caption, index) => {
      const startTime = formatSRTTime(caption.startTime);
      const endTime = formatSRTTime(caption.endTime);
      srt += `${index + 1}\n${startTime} --> ${endTime}\n${caption.text}\n\n`;
    });
    
    const blob = new Blob([srt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'captions.srt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatSRTTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 1000);
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
  };

  const renderCommand = `npx remotion render src/remotion/index.ts CaptionedVideo output.mp4 --props=captions.json`;

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
              className="relative w-full max-w-2xl bg-slate-900 rounded-3xl p-8 border border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-400/30">
                    <Download className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Export Video</h3>
                    <p className="text-slate-400 text-sm">Download captions + render locally</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-400/30 mb-6">
                  <p className="text-blue-300 text-sm leading-relaxed">
                    <strong>Note:</strong> Video rendering requires FFmpeg and isn't available on hosted platforms. 
                    Download your captions below and render locally!
                  </p>
                </div>
              </div>

              {/* Download Captions */}
              <div className="mb-8">
                <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <span className="text-xl">📥</span>
                  Step 1: Download Your Captions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={downloadCaptionsJSON}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-amber-500/20 border border-amber-400/30 hover:bg-amber-500/30 transition-colors"
                  >
                    <FileJson className="w-5 h-5 text-amber-400" />
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm">captions.json</div>
                      <div className="text-slate-400 text-xs">For Remotion</div>
                    </div>
                  </button>
                  <button
                    onClick={downloadCaptionsSRT}
                    className="flex items-center justify-center gap-2 p-4 rounded-xl bg-purple-500/20 border border-purple-400/30 hover:bg-purple-500/30 transition-colors"
                  >
                    <FileText className="w-5 h-5 text-purple-400" />
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm">captions.srt</div>
                      <div className="text-slate-400 text-xs">For video editors</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Step 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                      2
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

                {/* Step 3 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h4 className="font-semibold text-white">Place your files</h4>
                  </div>
                  <div className="ml-8 text-slate-300 text-sm space-y-2">
                    <p>• Copy your <strong className="text-white">video file</strong> to the project root</p>
                    <p>• Move the downloaded <strong className="text-white">captions.json</strong> to the project root</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h4 className="font-semibold text-white">Render your video</h4>
                  </div>
                  <div className="ml-8">
                    <div className="p-3 rounded-lg bg-slate-800 font-mono text-sm text-green-400 overflow-x-auto">
                      {renderCommand}
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(renderCommand);
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
