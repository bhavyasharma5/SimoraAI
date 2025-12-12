'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { CaptionStyle, CaptionStyleConfig } from '@/types';
import { getAllStyles } from '@/lib/caption-styles';
import { cn } from '@/lib/utils';

interface StyleSelectorProps {
  selectedStyle: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onStyleChange,
}) => {
  const styles = getAllStyles();

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🎨</span>
        Caption Style
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {styles.map((style, index) => (
          <StyleCard
            key={style.id}
            style={style}
            isSelected={selectedStyle === style.id}
            onSelect={() => onStyleChange(style.id)}
            delay={index * 0.1}
          />
        ))}
      </div>
    </div>
  );
};

interface StyleCardProps {
  style: CaptionStyleConfig;
  isSelected: boolean;
  onSelect: () => void;
  delay: number;
}

const StyleCard: React.FC<StyleCardProps> = ({
  style,
  isSelected,
  onSelect,
  delay,
}) => {
  return (
    <motion.button
      onClick={onSelect}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative p-4 rounded-2xl text-left transition-all duration-300',
        'border-2',
        isSelected
          ? 'bg-gradient-to-br from-amber-400/20 to-orange-500/20 border-amber-400'
          : 'bg-slate-800/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
      )}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-slate-900" />
        </motion.div>
      )}

      <div className="flex items-start gap-3">
        <span className="text-3xl">{style.preview}</span>
        <div className="flex-1">
          <h4 className={cn(
            'font-semibold transition-colors',
            isSelected ? 'text-amber-400' : 'text-white'
          )}>
            {style.name}
          </h4>
          <p className="text-slate-400 text-sm mt-1 leading-relaxed">
            {style.description}
          </p>
        </div>
      </div>

      {/* Style Preview */}
      <div className="mt-4 relative h-16 rounded-lg bg-slate-900/80 overflow-hidden">
        <StylePreview style={style} />
      </div>
    </motion.button>
  );
};

const StylePreview: React.FC<{ style: CaptionStyleConfig }> = ({ style }) => {
  const sampleText = "Hello दुनिया!";
  
  const getPositionStyles = (): React.CSSProperties => {
    switch (style.position) {
      case 'top':
        return { top: 4, left: 0, right: 0 };
      case 'center':
        return { top: '50%', left: 0, right: 0, transform: 'translateY(-50%)' };
      case 'bottom':
      default:
        return { bottom: 4, left: 0, right: 0 };
    }
  };

  return (
    <div
      className="absolute flex justify-center"
      style={getPositionStyles()}
    >
      <div
        style={{
          background: style.backgroundColor,
          color: style.textColor,
          fontSize: 11,
          fontFamily: style.fontFamily,
          padding: '4px 8px',
          borderRadius: style.borderRadius / 3,
          textAlign: 'center',
          fontWeight: 600,
        }}
      >
        {sampleText}
      </div>
    </div>
  );
};

