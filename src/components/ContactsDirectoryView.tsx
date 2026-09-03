import React, { useState } from 'react';
import { Search, MessageSquare, Video, Phone, Mail, Ban, UserCheck } from 'lucide-react';
import { Contact } from '../types';

interface ContactsDirectoryViewProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onStartVideoCall: (contactId: string) => void;
  profileImage?: string;
  onProfileClick?: () => void;
}

export const ContactsDirectoryView: React.FC<ContactsDirectoryViewProps> = ({
  contacts,
  onSelectContact,
  onStartVideoCall,
  profileImage,
  onProfileClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone && c.phone.includes(searchQuery)) ||
    (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div id="contacts-directory-container" className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {profileImage && (
              <button 
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full overflow-hidden border border-neutral-200 shadow-sm active:scale-95 transition-transform"
              >
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            )}
            <h1 id="directory-title" className="text-xl font-bold text-neutral-900 tracking-tight">
              Contacts
            </h1>
          </div>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {contacts.length} People
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="directory-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, phone, or email..."
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 hover:bg-neutral-150 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-colors"
          />
        </div>
      </header>

      {/* Directory List */}
      <div id="directory-list" className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-sm">
            No contacts match &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          filtered.map((contact) => (
            <div
              key={contact.id}
              id={`directory-contact-${contact.id}`}
              className="flex items-center justify-between gap-3 px-6 py-3.5 hover:bg-neutral-50 transition-colors"
            >
              <button
                type="button"
                onClick={() => onSelectContact(contact)}
                className="flex items-center gap-3.5 text-left flex-1 min-w-0 focus:outline-none"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-11 h-11 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center text-sm font-semibold">
                    {contact.avatarText}
                  </div>
                  {contact.status === 'online' ? (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                  ) : (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-neutral-300 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {contact.name}
                    </p>
                    {contact.isBlocked && (
                      <span className="text-[10px] text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                        Blocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate mt-0.5">
                    {contact.about || contact.phone || contact.email}
                  </p>
                </div>
              </button>

              {/* Action Buttons: Chat & Video Call */}
              <div className="flex items-center gap-1">
                <button
                  id={`dir-chat-btn-${contact.id}`}
                  type="button"
                  onClick={() => onSelectContact(contact)}
                  title={`Chat with ${contact.name}`}
                  className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                {!contact.isBlocked && (
                  <button
                    id={`dir-video-btn-${contact.id}`}
                    type="button"
                    onClick={() => onStartVideoCall(contact.id)}
                    title={`Video call ${contact.name}`}
                    className="p-2 text-neutral-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                  >
                    <Video className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
