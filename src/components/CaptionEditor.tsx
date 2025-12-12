'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, Plus, Clock, Save, X } from 'lucide-react';
import { Caption } from '@/types';
import { cn, formatTime, generateId } from '@/lib/utils';

interface CaptionEditorProps {
  captions: Caption[];
  onCaptionsChange: (captions: Caption[]) => void;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const CaptionEditor: React.FC<CaptionEditorProps> = ({
  captions,
  onCaptionsChange,
  currentTime,
  onSeek,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleEdit = (caption: Caption) => {
    setEditingId(caption.id);
    setEditText(caption.text);
  };

  const handleSave = (id: string) => {
    onCaptionsChange(
      captions.map((cap) =>
        cap.id === id ? { ...cap, text: editText } : cap
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id: string) => {
    onCaptionsChange(captions.filter((cap) => cap.id !== id));
  };

  const handleAdd = () => {
    const newCaption: Caption = {
      id: generateId(),
      text: 'New caption',
      startTime: currentTime,
      endTime: currentTime + 3,
    };
    onCaptionsChange([...captions, newCaption].sort((a, b) => a.startTime - b.startTime));
  };

  const isActive = (caption: Caption) =>
    currentTime >= caption.startTime && currentTime <= caption.endTime;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span className="text-2xl">📝</span>
          Captions
          <span className="ml-2 px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-sm font-normal">
            {captions.length}
          </span>
        </h3>
        <motion.button
          onClick={handleAdd}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400/20 text-amber-400 hover:bg-amber-400/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </motion.button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {captions.map((caption, index) => (
            <motion.div
              key={caption.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                'relative p-4 rounded-xl border transition-all duration-300 cursor-pointer',
                isActive(caption)
                  ? 'bg-amber-400/10 border-amber-400/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              )}
              onClick={() => onSeek(caption.startTime)}
            >
              {isActive(caption) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 rounded-l-xl"
                />
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* Timing */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(caption.startTime)}</span>
                    <span>→</span>
                    <span>{formatTime(caption.endTime)}</span>
                  </div>

                  {/* Text */}
                  {editingId === caption.id ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:border-amber-400 focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSave(caption.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                      />
                      <button
                        onClick={() => handleSave(caption.id)}
                        className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className={cn(
                      'text-sm leading-relaxed',
                      isActive(caption) ? 'text-white font-medium' : 'text-slate-300'
                    )}>
                      {caption.text}
                    </p>
                  )}
                </div>

                {/* Actions */}
                {editingId !== caption.id && (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(caption)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(caption.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {captions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">🎬</div>
            <p className="text-slate-400">No captions yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Click &quot;Auto-generate&quot; or add captions manually
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

