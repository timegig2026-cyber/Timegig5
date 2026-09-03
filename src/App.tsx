/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Contact, Message, CallSession, BottomTab, CallLogItem, AppNotification } from './types';
import { INITIAL_CONTACTS, INITIAL_CALL_LOGS } from './data/mockContacts';
import { ContactsList } from './components/ContactsList';
import { ChatConversation } from './components/ChatConversation';
import { CallsView } from './components/CallsView';
import { ContactsDirectoryView } from './components/ContactsDirectoryView';
import { SettingsView } from './components/SettingsView';
import { NotificationsView } from './components/NotificationsView';
import { MarketView } from './components/MarketView';
import { BottomMenuBar } from './components/BottomMenuBar';
import { IncomingCallModal } from './components/IncomingCallModal';
import { VideoCallModal } from './components/VideoCallModal';
import { callAudio } from './utils/callAudio';

export default function App() {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(INITIAL_CALL_LOGS);
  const [currentTab, setCurrentTab] = useState<BottomTab>('chats');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      contactId: 'contact-3',
      type: 'missed_call',
      title: 'Missed video call',
      description: 'David Kim tried to call you on video.',
      time: '25m ago',
      isRead: false,
    },
    {
      id: 'notif-2',
      contactId: 'contact-1',
      type: 'message',
      title: 'New message from Sarah',
      description: 'Sounds good! Let me know what time works best for you.',
      time: '1h ago',
      isRead: false,
    },
    {
      id: 'notif-3',
      contactId: 'contact-2',
      type: 'like',
      title: 'David Chen liked your message',
      description: '"Awesome! I\'ll take a look right now."',
      time: '2h ago',
      isRead: false,
    },
    {
      id: 'notif-4',
      type: 'market',
      title: 'New marketplace listing',
      description: 'Sarah Jenkins listed "Mid-Century Velvet Lounge Armchair" for R 2,800.',
      time: '3h ago',
      isRead: true,
    },
  ]);

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      time: 'Just now',
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const selectedContact = contacts.find((c) => c.id === selectedContactId) || null;
  const callContact = contacts.find((c) => c.id === activeCall?.contactId) || null;

  const handleSelectContact = (contact: Contact) => {
    setSelectedContactId(contact.id);
  };

  const handleBackToContacts = () => {
    setSelectedContactId(null);
  };

  const handleSelectTab = (tab: BottomTab) => {
    setCurrentTab(tab);
    setSelectedContactId(null);
  };

  const handleStartVideoCall = (contactId: string) => {
    const target = contacts.find((c) => c.id === contactId);
    if (!target || target.isBlocked) return;

    // Add to recent call history
    const newLog: CallLogItem = {
      id: `call-${Date.now()}`,
      contactId,
      type: 'video',
      direction: 'outgoing',
      timestamp: 'Just now',
    };
    setCallLogs((prev) => [newLog, ...prev]);

    setActiveCall({
      contactId,
      type: 'video',
      direction: 'outgoing',
      status: 'outgoing',
    });
  };

  const handleAcceptCall = () => {
    callAudio.playConnectSound();
    setActiveCall((prev) =>
      prev ? { ...prev, status: 'connected', startedAt: Date.now() } : null
    );
  };

  const handleDeclineCall = () => {
    callAudio.playEndSound();
    setActiveCall(null);
  };

  const handleEndCall = () => {
    callAudio.playEndSound();
    setActiveCall(null);
  };

  const handleCallConnected = () => {
    setActiveCall((prev) =>
      prev ? { ...prev, status: 'connected', startedAt: Date.now() } : null
    );
  };

  const handleSendMessage = (
    contactId: string,
    content: { text?: string; imageUrl?: string; videoUrl?: string }
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: content.text,
      imageUrl: content.imageUrl,
      videoUrl: content.videoUrl,
      timestamp: timeNow,
    };

    const previewSnippet = content.text
      ? content.text
      : content.imageUrl
      ? '📷 Photo'
      : content.videoUrl
      ? '🎥 Video'
      : 'Message';

    setContacts((prevContacts) =>
      prevContacts.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            recentMessage: previewSnippet,
            recentMessageTime: timeNow,
            messages: [...c.messages, newMessage],
          };
        }
        return c;
      })
    );

    // Simulated contact response if contact is not blocked
    const targetContact = contacts.find((c) => c.id === contactId);
    if (targetContact && !targetContact.isBlocked) {
      setTimeout(() => {
        const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const contactReplies = [
          "Got it! Thanks for letting me know. 😊👍",
          "Looks great! Appreciate you sharing that. ✨",
          "Awesome! I'll take a look right now. 🚀",
          "Sounds perfect to me! Catch you soon. 🙌🎉",
          "Love this! Let's talk more in a bit. ☕",
        ];
        const randomReply = contactReplies[Math.floor(Math.random() * contactReplies.length)];
        const replyMessage: Message = {
          id: `reply-${Date.now()}`,
          sender: 'contact',
          text: randomReply,
          timestamp: replyTime,
        };

        setContacts((prev) =>
          prev.map((c) => {
            if (c.id === contactId && !c.isBlocked) {
              return {
                ...c,
                recentMessage: randomReply,
                recentMessageTime: replyTime,
                messages: [...c.messages, replyMessage],
              };
            }
            return c;
          })
        );

        addNotification({
          contactId,
          type: 'message',
          title: `New message from ${targetContact.name}`,
          description: randomReply,
        });
      }, 1000);
    }
  };

  const handleToggleLikeMessage = (contactId: string, messageId: string) => {
    let likedMsgText = '';
    let contactName = '';
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) contactName = contact.name;

    let targetIsLikedNow = false;

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === messageId) {
                targetIsLikedNow = !m.liked;
                likedMsgText = m.text || 'Attachment';
                return { ...m, liked: targetIsLikedNow };
              }
              return m;
            }),
          };
        }
        return c;
      })
    );

    if (targetIsLikedNow) {
      addNotification({
        contactId,
        type: 'like',
        title: `${contactName || 'Contact'} liked your message`,
        description: `"${likedMsgText}"`,
      });
    }
  };

  const handleEditMessage = (contactId: string, messageId: string, newText: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const updatedMessages = c.messages.map((m) =>
            m.id === messageId ? { ...m, text: newText, isEdited: true } : m
          );
          const lastMsg = updatedMessages[updatedMessages.length - 1];
          return {
            ...c,
            recentMessage: lastMsg?.text || c.recentMessage,
            messages: updatedMessages,
          };
        }
        return c;
      })
    );
  };

  const handleDeleteMessage = (contactId: string, messageId: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          const updatedMessages = c.messages.filter((m) => m.id !== messageId);
          const lastMsg = updatedMessages[updatedMessages.length - 1];
          const newRecent = lastMsg
            ? lastMsg.text || (lastMsg.imageUrl ? '📷 Photo' : '🎥 Video')
            : 'No messages yet';
          return {
            ...c,
            recentMessage: newRecent,
            messages: updatedMessages,
          };
        }
        return c;
      })
    );
  };

  const handleClearConversation = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            recentMessage: 'No messages yet',
            messages: [],
          };
        }
        return c;
      })
    );
  };

  const handleToggleBlockContact = (contactId: string) => {
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            isBlocked: !c.isBlocked,
          };
        }
        return c;
      })
    );
  };

  const handleReportContact = (contactId: string, reason: string, details: string) => {
    console.log(`Report submitted for contact ${contactId}:`, { reason, details });
  };

  return (
    <div id="app-root" className="relative h-screen w-full bg-white flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {selectedContact ? (
          /* Active Chat Conversation with Selected Contact & Bottom Input Box */
          <motion.div
            key={`conversation-${selectedContact.id}`}
            id="conversation-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className="flex-1 h-full w-full flex flex-col bg-white overflow-hidden"
          >
            <ChatConversation
              contact={selectedContact}
              onBack={handleBackToContacts}
              onSendMessage={handleSendMessage}
              onToggleLikeMessage={handleToggleLikeMessage}
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
              onClearConversation={handleClearConversation}
              onToggleBlockContact={handleToggleBlockContact}
              onReportContact={handleReportContact}
              onStartVideoCall={handleStartVideoCall}
            />
          </motion.div>
        ) : (
          /* Primary Tab Views (Chats, Calls, Contacts, Settings) with Bottom Navigation Bar */
          <motion.div
            key={`tab-view-${currentTab}`}
            id="main-tab-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="flex-1 h-full w-full flex flex-col bg-white overflow-hidden"
          >
            {currentTab === 'chats' && (
              <ContactsList
                contacts={contacts}
                onSelectContact={handleSelectContact}
                onStartVideoCall={handleStartVideoCall}
              />
            )}

            {currentTab === 'calls' && (
              <CallsView
                contacts={contacts}
                callLogs={callLogs}
                onStartVideoCall={handleStartVideoCall}
                onSelectContact={handleSelectContact}
              />
            )}

            {currentTab === 'contacts' && (
              <ContactsDirectoryView
                contacts={contacts}
                onSelectContact={handleSelectContact}
                onStartVideoCall={handleStartVideoCall}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView />
            )}

            {currentTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                contacts={contacts}
                onSelectContact={handleSelectContact}
                onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
                onClearAll={() => setNotifications([])}
                onNotificationClick={(notif) => {
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                  );
                  if (notif.contactId) {
                    const c = contacts.find((contact) => contact.id === notif.contactId);
                    if (c) handleSelectContact(c);
                  } else if (notif.type === 'market') {
                    setCurrentTab('market');
                  }
                }}
              />
            )}

            {currentTab === 'market' && (
              <MarketView
                contacts={contacts}
                onSelectContact={handleSelectContact}
                onSendMessage={handleSendMessage}
                onAddNotification={addNotification}
                onBack={() => setCurrentTab('chats')}
              />
            )}

            {/* Bottom Menu Bar - shown for tabs other than market */}
            {currentTab !== 'market' && (
              <BottomMenuBar
                activeTab={currentTab}
                onSelectTab={handleSelectTab}
                hasUnreadNotifications={notifications.some((n) => !n.isRead)}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming Video Call Modal */}
      {callContact && activeCall?.status === 'incoming' && (
        <IncomingCallModal
          contact={callContact}
          isOpen={true}
          onAccept={handleAcceptCall}
          onDecline={handleDeclineCall}
        />
      )}

      {/* Active Live Video Call Modal (Outgoing or Connected) */}
      {callContact &&
        activeCall &&
        (activeCall.status === 'outgoing' || activeCall.status === 'connected') && (
          <VideoCallModal
            contact={callContact}
            isOpen={true}
            status={activeCall.status}
            direction={activeCall.direction}
            onEndCall={handleEndCall}
            onConnected={handleCallConnected}
          />
        )}
    </div>
  );
}
