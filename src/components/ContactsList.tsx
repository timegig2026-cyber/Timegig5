import React, { useState } from 'react';
import { Search, Ban, Video } from 'lucide-react';
import { Contact } from '../types';

interface ContactsListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onStartVideoCall?: (contactId: string) => void;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onSelectContact,
  onStartVideoCall,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.recentMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="contacts-screen" className="flex flex-col h-screen w-full bg-white max-w-2xl mx-auto">
      {/* Top Header */}
      <header id="contacts-header" className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 id="contacts-heading" className="text-2xl font-semibold text-neutral-900 tracking-tight">
            Messages
          </h1>
          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
            {contacts.length} Contacts
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <label htmlFor="contacts-search-input" className="sr-only">Search contacts</label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            id="contacts-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts or conversations..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
          />
        </div>
      </header>

      {/* Contacts List */}
      <div id="contacts-list" className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {filteredContacts.length === 0 ? (
          <div id="no-contacts-found" className="flex flex-col items-center justify-center p-12 text-center text-neutral-500">
            <p className="text-sm font-medium">No contacts match &ldquo;{searchQuery}&rdquo;</p>
            <p className="text-xs text-neutral-400 mt-1">Try searching by a different name</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              id={`contact-row-${contact.id}`}
              className="w-full flex items-center justify-between gap-2 px-6 py-4 hover:bg-neutral-50 transition-colors"
            >
              <button
                id={`contact-item-${contact.id}`}
                type="button"
                onClick={() => onSelectContact(contact)}
                className="flex-1 flex items-center gap-4 text-left min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 rounded-lg"
              >
                {/* Avatar with Status indicator */}
                <div className="relative flex-shrink-0">
                  <div
                    id={`avatar-${contact.id}`}
                    className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center text-sm font-semibold tracking-wide"
                  >
                    {contact.avatarText}
                  </div>
                  {contact.status === 'online' ? (
                    <span
                      title="Online"
                      className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"
                    />
                  ) : (
                    <span
                      title="Offline"
                      className="absolute bottom-0 right-0 w-3 h-3 bg-neutral-300 border-2 border-white rounded-full"
                    />
                  )}
                </div>

                {/* Contact Info & Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm font-semibold text-neutral-900 truncate">
                        {contact.name}
                      </span>
                      {contact.isBlocked && (
                        <span
                          id={`blocked-badge-${contact.id}`}
                          className="inline-flex items-center gap-0.5 text-[10px] text-rose-600 font-medium bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded"
                        >
                          <Ban className="w-2.5 h-2.5" /> Blocked
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-neutral-400 flex-shrink-0">
                      {contact.recentMessageTime}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate">
                    {contact.recentMessage}
                  </p>
                </div>
              </button>

              {onStartVideoCall && !contact.isBlocked && (
                <button
                  id={`contact-video-call-btn-${contact.id}`}
                  type="button"
                  onClick={() => onStartVideoCall(contact.id)}
                  title={`Video call ${contact.name}`}
                  className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors flex-shrink-0"
                >
                  <Video className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
