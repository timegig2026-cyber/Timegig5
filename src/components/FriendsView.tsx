import React, { useState, useEffect } from 'react';
import { Search, UserPlus, UserCheck, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { collection, onSnapshot, query, where, getDocs, doc, setDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Contact } from '../types';

interface FriendsViewProps {
  onSelectContact: (contact: Contact) => void;
}

export const FriendsView: React.FC<FriendsViewProps> = ({ onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'discover'>('friends');
  const [friends, setFriends] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Load friends
    const qFriends = query(
      collection(db, 'friendships'),
      where('status', '==', 'accepted'),
      where('members', 'array-contains', auth.currentUser.uid)
    );

    const unsubFriends = onSnapshot(qFriends, async (snapshot) => {
      const friendshipData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      const friendIds = friendshipData.map((f: any) => 
        f.requesterId === auth.currentUser?.uid ? f.receiverId : f.requesterId
      );

      if (friendIds.length > 0) {
        const friendProfiles: any[] = [];
        for (const fId of friendIds) {
          const profileDoc = await getDocs(query(collection(db, 'profiles'), where('userId', '==', fId)));
          if (!profileDoc.empty) {
            friendProfiles.push({ id: profileDoc.docs[0].id, ...profileDoc.docs[0].data() });
          }
        }
        setFriends(friendProfiles);
      } else {
        setFriends([]);
      }
      setLoading(false);
    });

    // Load sent requests
    const qSent = query(
      collection(db, 'friendships'),
      where('requesterId', '==', auth.currentUser.uid),
      where('status', '==', 'pending')
    );
    const unsubSent = onSnapshot(qSent, (snapshot) => {
      setSentRequests(snapshot.docs.map(d => d.data().receiverId));
    });

    // Load suggested users
    const qUsers = query(collection(db, 'profiles'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const allUsers = snapshot.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter((u: any) => u.userId !== auth.currentUser?.uid);
      setSuggestedUsers(allUsers);
    });

    return () => {
      unsubFriends();
      unsubSent();
      unsubUsers();
    };
  }, []);

  const sendFriendRequest = async (targetUserId: string, targetEmail: string) => {
    if (!auth.currentUser) return;

    const friendshipId = [auth.currentUser.uid, targetUserId].sort().join('_');
    
    try {
      await setDoc(doc(db, 'friendships', friendshipId), {
        requesterId: auth.currentUser.uid,
        requesterEmail: auth.currentUser.email,
        receiverId: targetUserId,
        receiverEmail: targetEmail,
        status: 'pending',
        members: [auth.currentUser.uid, targetUserId],
        createdAt: serverTimestamp()
      });

      // Add notification for the receiver
      const notifId = `friend_req_${friendshipId}`;
      await setDoc(doc(db, 'notifications', notifId), {
        userId: targetUserId,
        requesterId: auth.currentUser.uid,
        type: 'friend_request',
        title: 'New Friend Request',
        description: `${auth.currentUser.email} wants to be your friend!`,
        time: new Date().toISOString(),
        isRead: false,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to send friend request:", err);
    }
  };

  const filteredFriends = friends.filter(f => 
    (f.displayName || f.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggested = suggestedUsers.filter(u => {
    const isFriend = friends.some(f => f.userId === u.userId);
    const matchesSearch = (u.displayName || u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    return !isFriend && matchesSearch;
  });

  return (
    <div id="friends-view-container" className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Friends</h1>
          <div className="flex bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'friends' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              My Friends
            </button>
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${activeTab === 'discover' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Discover
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'friends' ? "Search your friends..." : "Find new friends..."}
            className="w-full pl-10 pr-4 py-2 bg-neutral-100 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 rounded-xl border border-transparent focus:border-neutral-300 focus:outline-none transition-colors"
          />
        </div>
      </header>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {activeTab === 'friends' ? (
          filteredFriends.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-800">No friends yet</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                Go to the Discover tab to find people to connect with!
              </p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <div key={friend.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    {friend.displayName?.[0]?.toUpperCase() || friend.email?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{friend.displayName || friend.email}</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Friend
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onSelectContact({
                      id: friend.userId,
                      name: friend.displayName || friend.email,
                      avatarText: (friend.displayName || friend.email)[0].toUpperCase(),
                      status: 'online',
                      recentMessage: '',
                      recentMessageTime: '',
                      messages: []
                    })}
                    className="p-2 text-neutral-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )
        ) : (
          filteredSuggested.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center text-neutral-400">
              <p className="text-sm">No new people found.</p>
            </div>
          ) : (
            filteredSuggested.map((user) => {
              const isSent = sentRequests.includes(user.userId);
              return (
                <div key={user.id} className="px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center font-bold">
                      {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{user.displayName || user.email}</p>
                      <p className="text-[10px] text-neutral-500 font-medium">Potential Contact</p>
                    </div>
                  </div>
                  {isSent ? (
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-neutral-100 text-neutral-500 rounded-lg text-[10px] font-bold">
                      <Clock className="w-3 h-3" /> Requested
                    </div>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user.userId, user.email)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm active:scale-95"
                    >
                      <UserPlus className="w-3 h-3" /> Add Friend
                    </button>
                  )}
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
};

import { Users } from 'lucide-react';
