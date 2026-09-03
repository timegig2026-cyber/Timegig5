import React from 'react';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Plus,
} from 'lucide-react';
import { Contact, CallLogItem } from '../types';

interface CallsViewProps {
  contacts: Contact[];
  callLogs: CallLogItem[];
  onStartVideoCall: (contactId: string) => void;
  onSelectContact: (contact: Contact) => void;
  profileImage?: string;
  onProfileClick?: () => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  contacts,
  callLogs,
  onStartVideoCall,
  onSelectContact,
  profileImage,
  onProfileClick,
}) => {
  const getContact = (id: string) => contacts.find((c) => c.id === id);

  return (
    <div id="calls-view-container" className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Calls Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {profileImage && (
              <button 
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 shadow-sm active:scale-95 transition-transform"
              >
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            )}
            <h1 id="calls-title" className="text-xl font-bold text-neutral-900 tracking-tight">
              Calls
            </h1>
          </div>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {callLogs.length} Recent
          </span>
        </div>
      </header>

      {/* Call History List */}
      <div id="calls-list" className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {callLogs.length === 0 ? (
          <div id="empty-calls-state" className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-14 h-14 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">No calls yet</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              When you make or receive video calls with your contacts, they will appear here.
            </p>
          </div>
        ) : (
          callLogs.map((log) => {
            const contact = getContact(log.contactId);
            if (!contact) return null;

            const isMissed = log.direction === 'missed';
            const isIncoming = log.direction === 'incoming';

            return (
              <div
                key={log.id}
                id={`call-log-item-${log.id}`}
                className="flex items-center justify-between gap-3 px-6 py-3.5 hover:bg-neutral-50 transition-colors"
              >
                {/* Contact Avatar */}
                <button
                  type="button"
                  onClick={() => onSelectContact(contact)}
                  className="flex items-center gap-3.5 text-left flex-1 min-w-0 group focus:outline-none"
                >
                  <div className="w-11 h-11 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    {contact.avatarText}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isMissed ? 'text-rose-600' : 'text-neutral-900'}`}>
                      {contact.name}
                    </p>

                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-neutral-500">
                      {isMissed ? (
                        <PhoneMissed className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                      ) : isIncoming ? (
                        <PhoneIncoming className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <PhoneOutgoing className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      )}

                      <span>{log.timestamp}</span>

                      {log.duration && (
                        <>
                          <span>•</span>
                          <span>{log.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </button>

                {/* Quick Call Button */}
                <button
                  id={`call-log-video-btn-${log.id}`}
                  type="button"
                  onClick={() => onStartVideoCall(contact.id)}
                  disabled={contact.isBlocked}
                  title={`Video call ${contact.name}`}
                  className="p-2.5 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 disabled:opacity-30 rounded-full transition-colors flex-shrink-0"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
