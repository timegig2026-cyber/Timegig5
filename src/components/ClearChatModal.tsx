import React from 'react';
import { Trash2, X } from 'lucide-react';
import { Contact } from '../types';

interface ClearChatModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onConfirmClear: () => void;
}

export const ClearChatModal: React.FC<ClearChatModalProps> = ({
  contact,
  isOpen,
  onClose,
  onConfirmClear,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="clear-chat-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="clear-chat-modal-card"
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-neutral-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-clear-modal-button"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
            <Trash2 className="w-6 h-6" />
          </div>

          <h3 id="clear-chat-title" className="text-lg font-semibold text-neutral-900">
            Clear all conversations?
          </h3>
          <p className="text-sm text-neutral-500 mt-1.5 leading-relaxed">
            This will delete all messages in your conversation with{' '}
            <span className="font-semibold text-neutral-800">{contact.name}</span>. This action cannot be undone.
          </p>

          <div className="flex items-center gap-3 w-full mt-6">
            <button
              id="cancel-clear-chat-button"
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-clear-chat-button"
              type="button"
              onClick={() => {
                onConfirmClear();
                onClose();
              }}
              className="flex-1 py-2.5 px-4 text-sm font-medium rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
            >
              Clear Messages
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
