export interface Message {
  id: string;
  sender: 'user' | 'contact';
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  timestamp: string;
  liked?: boolean;
  isEdited?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  avatarText: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  phone?: string;
  email?: string;
  about?: string;
  isBlocked?: boolean;
  videoStreamUrl?: string;
  recentMessage: string;
  recentMessageTime: string;
  messages: Message[];
}

export type CallStatus = 'idle' | 'outgoing' | 'incoming' | 'connected' | 'ended';

export type BottomTab = 'chats' | 'calls' | 'contacts' | 'settings' | 'notifications' | 'market' | 'admin';

export interface CallLogItem {
  id: string;
  contactId: string;
  type: 'video' | 'voice';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface CallSession {
  contactId: string;
  type: 'video';
  direction: 'outgoing' | 'incoming';
  status: CallStatus;
  startedAt?: number;
}

export interface AppNotification {
  id: string;
  contactId?: string;
  type: 'missed_call' | 'message' | 'like' | 'market' | 'security';
  title: string;
  description: string;
  time: string;
  isRead: boolean;
}

