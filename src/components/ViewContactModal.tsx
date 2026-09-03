import React from 'react';
import { X, Phone, Mail, Ban, ShieldCheck, Info } from 'lucide-react';
import { Contact } from '../types';

interface ViewContactModalProps {
  contact: Contact;
  isOpen: boolean;
  onClose: () => void;
  onToggleBlock: () => void;
}

export const ViewContactModal: React.FC<ViewContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  onToggleBlock,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="view-contact-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        id="view-contact-modal-card"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-neutral-100 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-view-contact-button"
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contact Avatar & Header */}
        <div className="flex flex-col items-center text-center mt-2 mb-6">
          <div className="relative mb-3">
            <div
              id="view-contact-avatar"
              className="w-20 h-20 rounded-full bg-neutral-100 text-neutral-800 border-2 border-neutral-200 flex items-center justify-center text-2xl font-bold"
            >
              {contact.avatarText}
            </div>
            <span
              className={`absolute bottom-0 right-1 w-4 h-4 rounded-full border-2 border-white ${
                contact.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            />
          </div>

          <h3 id="view-contact-name" className="text-xl font-semibold text-neutral-900">
            {contact.name}
          </h3>
          <p id="view-contact-status" className="text-xs text-neutral-500 mt-0.5">
            {contact.status === 'online'
              ? 'Active now'
              : contact.lastSeen
              ? `Last seen ${contact.lastSeen}`
              : 'Offline'}
          </p>

          {contact.isBlocked && (
            <span
              id="view-contact-blocked-tag"
              className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200"
            >
              <Ban className="w-3.5 h-3.5" /> Blocked
            </span>
          )}
        </div>

        {/* Contact Information Fields */}
        <div className="space-y-4 border-t border-b border-neutral-100 py-4 mb-6 text-sm">
          {contact.about && (
            <div className="flex items-start gap-3">
              <Info className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" />
              <div>
                <span className="text-xs text-neutral-400 block font-medium">About</span>
                <p id="view-contact-about" className="text-neutral-800 text-sm mt-0.5 leading-relaxed">
                  {contact.about}
                </p>
              </div>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-neutral-400 block font-medium">Phone</span>
                <a
                  id="view-contact-phone"
                  href={`tel:${contact.phone}`}
                  className="text-neutral-900 font-medium hover:underline text-sm"
                >
                  {contact.phone}
                </a>
              </div>
            </div>
          )}

          {contact.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-neutral-400 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-xs text-neutral-400 block font-medium">Email</span>
                <a
                  id="view-contact-email"
                  href={`mailto:${contact.email}`}
                  className="text-neutral-900 font-medium hover:underline text-sm"
                >
                  {contact.email}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            id="modal-toggle-block-button"
            type="button"
            onClick={() => {
              onToggleBlock();
            }}
            className={`w-full py-2.5 px-4 text-sm font-medium rounded-xl border flex items-center justify-center gap-2 transition-colors ${
              contact.isBlocked
                ? 'text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                : 'text-rose-600 border-rose-200 hover:bg-rose-50'
            }`}
          >
            {contact.isBlocked ? (
              <>
                <ShieldCheck className="w-4 h-4" /> Unblock {contact.name}
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" /> Block {contact.name}
              </>
            )}
          </button>

          <button
            id="close-contact-modal-done"
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-sm font-medium rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
