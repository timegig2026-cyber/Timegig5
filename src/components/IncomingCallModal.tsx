import React, { useEffect } from 'react';
import { Video, PhoneOff } from 'lucide-react';
import { Contact } from '../types';
import { callAudio } from '../utils/callAudio';

interface IncomingCallModalProps {
  contact: Contact;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  contact,
  isOpen,
  onAccept,
  onDecline,
}) => {
  useEffect(() => {
    if (isOpen) {
      callAudio.startIncomingRingtone();
    } else {
      callAudio.stopRingtone();
    }
    return () => {
      callAudio.stopRingtone();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="incoming-call-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        id="incoming-call-card"
        className="relative w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 text-white p-8 flex flex-col items-center shadow-2xl overflow-hidden"
      >
        {/* Pulsing ring background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Incoming Video Call
        </span>

        {/* Contact Avatar with concentric animated pulses */}
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75 duration-1000" />
          <div className="relative w-24 h-24 rounded-full bg-neutral-800 border-2 border-emerald-500 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
            {contact.avatarText}
          </div>
        </div>

        <h3 id="incoming-caller-name" className="text-xl font-bold text-white text-center">
          {contact.name}
        </h3>
        <p className="text-sm text-neutral-400 mt-1 mb-8 text-center">
          Incoming video call...
        </p>

        {/* Action Buttons: Accept & Decline */}
        <div className="flex items-center justify-center gap-8 w-full">
          {/* Decline button */}
          <div className="flex flex-col items-center gap-2">
            <button
              id="decline-call-button"
              type="button"
              onClick={onDecline}
              aria-label="Decline Call"
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-xs text-neutral-400 font-medium">Decline</span>
          </div>

          {/* Accept button */}
          <div className="flex flex-col items-center gap-2">
            <button
              id="accept-call-button"
              type="button"
              onClick={onAccept}
              aria-label="Accept Video Call"
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform animate-bounce"
            >
              <Video className="w-6 h-6" />
            </button>
            <span className="text-xs text-emerald-400 font-medium">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};
