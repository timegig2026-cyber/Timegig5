import React, { useState, useRef, useEffect } from 'react';
import {
  Edit3,
  Trash2,
  Share2,
  Check,
  X,
  Play,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  onToggleLike: (messageId: string) => void;
  onEditMessage: (messageId: string, newText: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onShareMessage: (messageText: string) => void;
  onOpenMedia: (type: 'image' | 'video', url: string, caption?: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onToggleLike,
  onEditMessage,
  onDeleteMessage,
  onShareMessage,
  onOpenMedia,
}) => {
  const isUser = message.sender === 'user';
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text || '');

  const lastTapRef = useRef<number>(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Close actions popover on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(e.target as Node)) {
        setShowActions(false);
      }
    };
    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, []);

  const handleBubbleClick = (e: React.MouseEvent) => {
    // If user is currently editing, don't trigger tap events
    if (isEditing) return;

    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 280;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double Tap detected -> toggle like / unlike 👍
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
        tapTimerRef.current = null;
      }
      lastTapRef.current = 0;
      setShowActions(false);
      onToggleLike(message.id);
    } else {
      // Single Tap detected -> wait to see if double tap follows
      lastTapRef.current = now;
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
      tapTimerRef.current = setTimeout(() => {
        setShowActions((prev) => !prev);
        tapTimerRef.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editText.trim()) return;
    onEditMessage(message.id, editText.trim());
    setIsEditing(false);
    setShowActions(false);
  };

  const handleCancelEdit = () => {
    setEditText(message.text || '');
    setIsEditing(false);
    setShowActions(false);
  };

  return (
    <div
      id={`message-wrapper-${message.id}`}
      className={`relative flex flex-col ${isUser ? 'items-end' : 'items-start'} my-2 select-none`}
    >
      {/* Floating Action Menu for Single Tap (Edit, Delete, Share) */}
      {showActions && !isEditing && (
        <div
          ref={actionsRef}
          id={`actions-menu-${message.id}`}
          className={`absolute -top-11 z-30 flex items-center gap-1 bg-neutral-900 text-white px-2 py-1 rounded-xl shadow-xl border border-neutral-700 animate-in fade-in zoom-in-95 duration-100 ${
            isUser ? 'right-0' : 'left-0'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Edit action */}
          {message.text && (
            <button
              id={`action-edit-${message.id}`}
              type="button"
              onClick={() => {
                setEditText(message.text || '');
                setIsEditing(true);
                setShowActions(false);
              }}
              title="Edit message"
              className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          )}

          {/* Delete action */}
          <button
            id={`action-delete-${message.id}`}
            type="button"
            onClick={() => {
              setShowActions(false);
              onDeleteMessage(message.id);
            }}
            title="Delete message"
            className="flex items-center gap-1 px-2 py-1 text-xs text-rose-300 hover:text-rose-200 hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>

          {/* Share action */}
          <button
            id={`action-share-${message.id}`}
            type="button"
            onClick={() => {
              setShowActions(false);
              onShareMessage(message.text || message.imageUrl || message.videoUrl || '');
            }}
            title="Share message"
            className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-200 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      )}

      {/* Main Message Bubble */}
      <div
        id={`message-bubble-${message.id}`}
        onClick={handleBubbleClick}
        className={`group relative max-w-[85%] sm:max-w-[75%] rounded-2xl cursor-pointer transition-all ${
          isUser
            ? 'bg-neutral-900 text-white rounded-br-sm'
            : 'bg-white text-neutral-900 border border-neutral-200 shadow-xs rounded-bl-sm'
        } ${showActions ? 'ring-2 ring-neutral-400 ring-offset-2' : ''}`}
      >
        {/* If Image exists */}
        {message.imageUrl && (
          <div
            className="relative overflow-hidden rounded-t-2xl group/media cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onOpenMedia('image', message.imageUrl!, message.text);
            }}
          >
            <img
              src={message.imageUrl}
              alt="Shared photo"
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="w-full max-h-72 object-cover transition-transform duration-200 group-hover/media:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/media:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> View Full Screen
              </span>
            </div>
          </div>
        )}

        {/* If Video exists */}
        {message.videoUrl && (
          <div
            className="relative overflow-hidden rounded-t-2xl bg-black group/video cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onOpenMedia('video', message.videoUrl!, message.text);
            }}
          >
            <video
              src={message.videoUrl}
              className="w-full max-h-64 object-contain"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-all group-hover/video:bg-black/50">
              <div className="w-12 h-12 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-lg group-hover/video:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current ml-0.5" />
              </div>
              <span className="mt-2 text-xs font-medium text-white/90 bg-black/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Maximize2 className="w-3 h-3" /> Play Full Screen
              </span>
            </div>
          </div>
        )}

        {/* Text Content or Inline Editing */}
        {isEditing ? (
          <div
            className="p-3 bg-white text-neutral-900 rounded-2xl border border-neutral-300 shadow-md min-w-[240px]"
            onClick={(e) => e.stopPropagation()}
          >
            <label className="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
              Edit message
            </label>
            <textarea
              rows={2}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full text-sm p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 resize-none"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-100"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="flex items-center gap-1 px-3 py-1 bg-neutral-900 text-white rounded-lg text-xs font-medium hover:bg-neutral-800"
              >
                <Check className="w-3.5 h-3.5" /> Save
              </button>
            </div>
          </div>
        ) : (
          message.text && (
            <div className="px-4 py-2.5">
              <p className="whitespace-pre-wrap leading-relaxed text-sm break-words">
                {message.text}
              </p>
            </div>
          )
        )}

        {/* Like 👍 Badge indicator (attached to bubble, toggled on double tap) */}
        {message.liked && (
          <span
            id={`like-badge-${message.id}`}
            title="Liked (double tap to unlike)"
            className={`absolute -bottom-2.5 ${
              isUser ? '-left-2' : '-right-2'
            } flex items-center justify-center w-6 h-6 bg-white border border-neutral-200 rounded-full shadow-md text-sm animate-in zoom-in-75 duration-150 select-none hover:scale-110 transition-transform`}
          >
            👍
          </span>
        )}
      </div>

      {/* Timestamp & Edited Marker */}
      <div className={`flex items-center gap-1.5 text-[10px] text-neutral-400 mt-1 px-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <span>{message.timestamp}</span>
        {message.isEdited && <span className="italic">(edited)</span>}
      </div>
    </div>
  );
};
