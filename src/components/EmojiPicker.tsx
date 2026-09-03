import React, { useState } from 'react';
import { X, Smile, Heart, ThumbsUp, Sparkles, Coffee } from 'lucide-react';

interface EmojiPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

interface EmojiCategory {
  name: string;
  icon: React.ReactNode;
  emojis: string[];
}

const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    name: 'Smileys',
    icon: <Smile className="w-3.5 h-3.5" />,
    emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘', '😋', '😎', '🥳', '🤩', '🤔', '🤨', '😐', '😏', '😴', '😷', '🤯'],
  },
  {
    name: 'Gestures',
    icon: <ThumbsUp className="w-3.5 h-3.5" />,
    emojis: ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👋', '🤚', '🖐️', '✋', '👏', '🙌', '👐', '🤲', '🙏', '💪', '🤝', '👊', '✊', '🤛', '🤜'],
  },
  {
    name: 'Hearts & Emotions',
    icon: <Heart className="w-3.5 h-3.5" />,
    emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
  },
  {
    name: 'Objects & Food',
    icon: <Coffee className="w-3.5 h-3.5" />,
    emojis: ['☕', '🍵', '🥤', '🍺', '🍕', '🍔', '🍟', '🥪', '🍣', '🎂', '🧁', '🍦', '🍩', '🥐', '🍎', '🍓', '🥑', '🎁', '📱', '💻', '📷', '🎥', '🎧', '🚀', '✈️'],
  },
  {
    name: 'Celebration & Symbols',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    emojis: ['🎉', '✨', '🔥', '💯', '⭐', '🌟', '💫', '💥', '🎈', '🏆', '🎯', '💡', '🔔', '📌', '⚡', '☀️', '🌈', '🌸', '🍀', '✅', '❌'],
  },
];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  isOpen,
  onClose,
  onSelectEmoji,
}) => {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  if (!isOpen) return null;

  return (
    <div
      id="emoji-picker-container"
      className="absolute bottom-16 left-3 z-40 w-72 sm:w-80 rounded-2xl bg-white border border-neutral-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-neutral-100 bg-neutral-50/80">
        <span className="text-xs font-semibold text-neutral-700">Emojis</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close emoji picker"
          className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-200/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between px-2 py-1.5 border-b border-neutral-100 bg-white">
        {EMOJI_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.name}
            type="button"
            onClick={() => setActiveCategoryIndex(idx)}
            title={cat.name}
            className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              activeCategoryIndex === idx
                ? 'bg-neutral-900 text-white'
                : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100'
            }`}
          >
            {cat.icon}
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="p-3 h-48 overflow-y-auto">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          {EMOJI_CATEGORIES[activeCategoryIndex].name}
        </p>
        <div className="grid grid-cols-6 gap-1.5">
          {EMOJI_CATEGORIES[activeCategoryIndex].emojis.map((emoji, index) => (
            <button
              key={`${emoji}-${index}`}
              type="button"
              onClick={() => onSelectEmoji(emoji)}
              className="flex items-center justify-center w-9 h-9 text-xl hover:bg-neutral-100 rounded-xl transition-transform hover:scale-125 active:scale-95"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
