import React from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  PhoneMissed,
  MessageSquare,
  Sparkles,
  Heart,
  Store,
} from 'lucide-react';
import { Contact, AppNotification } from '../types';

interface NotificationsViewProps {
  notifications: AppNotification[];
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  contacts,
  onSelectContact,
  onMarkAllRead,
  onClearAll,
  onNotificationClick,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div id="notifications-view-container" className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 id="notifications-title" className="text-xl font-bold text-neutral-900 tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                title="Mark all as read"
                className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
              </button>
            )}
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                title="Clear notifications"
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <div id="notifications-list" className="flex-1 overflow-y-auto divide-y divide-neutral-100">
        {notifications.length === 0 ? (
          <div id="empty-notifications-state" className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-neutral-800">No notifications</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              You are all caught up! Updates, missed calls, new messages, likes, and marketplace items will show up here.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <button
              key={item.id}
              id={`notification-item-${item.id}`}
              type="button"
              onClick={() => onNotificationClick(item)}
              className={`w-full text-left px-6 py-4 flex items-start gap-3.5 transition-colors ${
                !item.isRead ? 'bg-emerald-50/30 hover:bg-emerald-50/50' : 'hover:bg-neutral-50'
              }`}
            >
              {/* Type Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.type === 'missed_call'
                    ? 'bg-rose-100 text-rose-600'
                    : item.type === 'message'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.type === 'like'
                    ? 'bg-pink-100 text-pink-600'
                    : item.type === 'market'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-neutral-100 text-neutral-700'
                }`}
              >
                {item.type === 'missed_call' ? (
                  <PhoneMissed className="w-4 h-4" />
                ) : item.type === 'message' ? (
                  <MessageSquare className="w-4 h-4" />
                ) : item.type === 'like' ? (
                  <Heart className="w-4 h-4 fill-pink-600 text-pink-600" />
                ) : item.type === 'market' ? (
                  <Store className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p
                    className={`text-sm truncate ${
                      !item.isRead ? 'font-bold text-neutral-950' : 'font-semibold text-neutral-800'
                    }`}
                  >
                    {item.title}
                  </p>
                  <span className="text-[11px] text-neutral-400 whitespace-nowrap">
                    {item.time}
                  </span>
                </div>
                <p className="text-xs text-neutral-600 line-clamp-2 mt-0.5">
                  {item.description}
                </p>
              </div>

              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
