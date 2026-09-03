/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, query, collection, where, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { SignupView } from './components/SignupView';
import { AnimatePresence, motion } from 'motion/react';
import { Contact, Message, CallSession, BottomTab, CallLogItem, AppNotification } from './types';
import { INITIAL_CONTACTS, INITIAL_CALL_LOGS } from './data/mockContacts';
import { ContactsList } from './components/ContactsList';
import { ChatConversation } from './components/ChatConversation';
import { CallsView } from './components/CallsView';
import { ContactsDirectoryView } from './components/ContactsDirectoryView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { NotificationsView } from './components/NotificationsView';
import { MarketView } from './components/MarketView';
import { FriendsView } from './components/FriendsView';
import { BottomMenuBar } from './components/BottomMenuBar';
import { IncomingCallModal } from './components/IncomingCallModal';
import { VideoCallModal } from './components/VideoCallModal';
import { callAudio } from './utils/callAudio';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [forceEditProfile, setForceEditProfile] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [callLogs, setCallLogs] = useState<CallLogItem[]>(INITIAL_CALL_LOGS);
  const [currentTab, setCurrentTab] = useState<BottomTab>('chats');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<CallSession | null>(null);

  // Global wallpaper settings
  const [wallpaperSettings, setWallpaperSettings] = useState({ wallpaperUrl: '', blurAmount: 0 });

  useEffect(() => {
    // Listen to global config for wallpaper
    const unsub = onSnapshot(doc(db, 'configs', 'global'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setWallpaperSettings({
          wallpaperUrl: data.wallpaperUrl || '',
          blurAmount: data.blurAmount || 0
        });
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setShowSplash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  useEffect(() => {
    const handleNotify = (e: CustomEvent) => {
      addNotification(e.detail);
    };
    window.addEventListener('timegig_notify' as any, handleNotify);
    return () => window.removeEventListener('timegig_notify' as any, handleNotify);
  }, []);

  useEffect(() => {
    if (!user) return;
    // Listen to real-time notifications from Firestore
    const q = query(collection(db, 'notifications'), where('userId', '==', user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      const dbNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification));
      setNotifications(prev => {
        // Merge with local mock notifications for now, or just use DB
        const merged = [...dbNotifs];
        prev.forEach(p => {
          if (!merged.find(m => m.id === p.id)) merged.push(p);
        });
        return merged.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      });
    });
    return () => unsub();
  }, [user]);

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

  const handleAcceptFriend = async (notif: AppNotification) => {
    if (!user || !notif.requesterId) return;
    
    const friendshipId = [user.uid, notif.requesterId].sort().join('_');
    try {
      // Update friendship status
      await setDoc(doc(db, 'friendships', friendshipId), {
        status: 'accepted',
        acceptedAt: serverTimestamp()
      }, { merge: true });

      // Mark notification as read or delete it
      await deleteDoc(doc(db, 'notifications', notif.id));

      // Add success notification
      addNotification({
        type: 'security',
        title: 'Friend Request Accepted',
        description: 'You are now friends! You can now chat and see each other in the Friends tab.',
      });
    } catch (err) {
      console.error("Failed to accept friend request:", err);
    }
  };

  const handleDeclineFriend = async (notif: AppNotification) => {
    if (!user || !notif.requesterId) return;
    
    const friendshipId = [user.uid, notif.requesterId].sort().join('_');
    try {
      await deleteDoc(doc(db, 'friendships', friendshipId));
      await deleteDoc(doc(db, 'notifications', notif.id));
    } catch (err) {
      console.error("Failed to decline friend request:", err);
    }
  };

  const handleReportContact = (contactId: string, reason: string, details: string) => {
    console.log(`Report submitted for contact ${contactId}:`, { reason, details });
  };

  if (!isAuthReady) return <div className="h-screen w-full bg-neutral-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div></div>;

  if (!user && !showSplash) {
    return <SignupView 
      onSuccess={() => {
        setForceEditProfile(true);
        setCurrentTab('settings');
      }} 
    />;
  }

  return (
    <div id="app-root" className={`relative h-screen w-full flex flex-col overflow-hidden transition-colors duration-500 ${wallpaperSettings.wallpaperUrl ? 'bg-transparent' : 'bg-white'}`}>
      {/* Global Background Layer */}
      {wallpaperSettings.wallpaperUrl && (
        <div 
          className="fixed inset-0 z-0 pointer-events-none transition-all duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${wallpaperSettings.wallpaperUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: `blur(${wallpaperSettings.blurAmount}px)`,
            opacity: 1
          }}
        />
      )}
      
      <AnimatePresence mode="wait">
        {showSplash ? (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex-1 flex flex-col items-center justify-center z-50 ${wallpaperSettings.wallpaperUrl ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'}`}
          >
            <h1 className="text-5xl font-black tracking-tight text-neutral-900 mb-2">TimeGiG</h1>
            <p className="text-neutral-500 font-medium tracking-wide">Connect • Market • Thrive</p>
          </motion.div>
        ) : selectedContact ? (
          /* Active Chat Conversation with Selected Contact & Bottom Input Box */
          <motion.div
            key={`conversation-${selectedContact.id}`}
            id="conversation-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.15 }}
            className={`flex-1 h-full w-full flex flex-col overflow-hidden ${wallpaperSettings.wallpaperUrl ? 'bg-white/90 backdrop-blur-md' : 'bg-white'}`}
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
            className={`flex-1 h-full w-full flex flex-col overflow-hidden ${wallpaperSettings.wallpaperUrl ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'}`}
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
              <SettingsView forceEditProfile={forceEditProfile} onProfileDone={() => {
                setForceEditProfile(false);
                setCurrentTab('market');
              }} />
            )}
            {currentTab === 'admin' && user?.email?.toLowerCase() === 'timegig2026@gmail.com' && (
              <AdminView />
            )}

            {currentTab === 'notifications' && (
              <NotificationsView
                notifications={notifications}
                contacts={contacts}
                onSelectContact={handleSelectContact}
                onMarkAllRead={() => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))}
                onClearAll={() => setNotifications([])}
                onAcceptFriend={handleAcceptFriend}
                onDeclineFriend={handleDeclineFriend}
                onNotificationClick={(notif) => {
                  setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                  );
                  if (notif.contactId) {
                    const c = contacts.find((contact) => contact.id === notif.contactId);
                    if (c) handleSelectContact(c);
                  } else if (notif.type === 'market') {
                    setCurrentTab('market');
                  } else if (notif.type === 'friend_request') {
                    // Stay on notifications to act on it
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

            {currentTab === 'friends' && (
              <FriendsView onSelectContact={handleSelectContact} />
            )}

            {/* Bottom Menu Bar - always visible */}
            <BottomMenuBar
              activeTab={currentTab}
              onSelectTab={handleSelectTab}
              hasUnreadNotifications={notifications.some((n) => !n.isRead)}
              isAdmin={user?.email?.toLowerCase() === 'timegig2026@gmail.com'}
            />
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
