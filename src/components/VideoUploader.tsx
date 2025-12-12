'use client';

import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Film, X, Check, Loader2 } from 'lucide-react';
import { cn, formatFileSize } from '@/lib/utils';

interface VideoUploaderProps {
  onVideoUpload: (file: File, videoUrl: string) => void;
  isUploading: boolean;
}

export const VideoUploader: React.FC<VideoUploaderProps> = ({
  onVideoUpload,
  isUploading,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid video file (MP4 recommended)');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = () => {
    if (selectedFile && previewUrl) {
      onVideoUpload(selectedFile, previewUrl);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="uploader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            <label
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'relative flex flex-col items-center justify-center w-full h-80 rounded-3xl cursor-pointer transition-all duration-500',
                'bg-gradient-to-br from-slate-900/50 to-slate-800/50',
                'border-2 border-dashed',
                isDragOver
                  ? 'border-amber-400 bg-amber-400/10 scale-[1.02]'
                  : 'border-slate-600 hover:border-amber-400/50 hover:bg-slate-800/50'
              )}
            >
              <input
                type="file"
                accept="video/mp4,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              <motion.div
                animate={{
                  scale: isDragOver ? 1.1 : 1,
                  rotate: isDragOver ? 5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-2xl opacity-30" />
                <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 p-5 rounded-2xl">
                  <Upload className="w-10 h-10 text-slate-900" />
                </div>
              </motion.div>

              <h3 className="mt-6 text-xl font-semibold text-white">
                {isDragOver ? 'Drop your video here' : 'Upload your video'}
              </h3>
              <p className="mt-2 text-slate-400 text-center max-w-sm">
                Drag and drop your MP4 video or click to browse.
                <br />
                <span className="text-amber-400/80 text-sm">Supports up to 500MB</span>
              </p>

              <div className="flex items-center gap-4 mt-6">
                <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/50 text-slate-300 text-sm">
                  <Film className="w-4 h-4" />
                  MP4, WebM, MOV
                </span>
              </div>
            </label>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-amber-400/20 to-orange-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-3xl p-6 border border-slate-700"
          >
            <button
              onClick={clearSelection}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-700/50 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Video Preview */}
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-black">
                <video
                  src={previewUrl || undefined}
                  className="w-full h-64 lg:h-80 object-contain"
                  controls
                  muted
                />
              </div>

              {/* File Info */}
              <div className="flex flex-col justify-between lg:w-72">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-400/20 to-emerald-500/20 border border-green-400/30">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Video Ready</h4>
                      <p className="text-slate-400 text-sm">Ready to process</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        File Name
                      </p>
                      <p className="text-white font-medium truncate">
                        {selectedFile.name}
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        File Size
                      </p>
                      <p className="text-white font-medium">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleUpload}
                  disabled={isUploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'mt-6 w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300',
                    'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-900',
                    'hover:shadow-lg hover:shadow-amber-500/25',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {isUploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Continue to Captions'
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

