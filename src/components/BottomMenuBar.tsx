import React from 'react';
import { MessageCircleMore, Bell, Store, User, ShieldAlert, Users } from 'lucide-react';
import { BottomTab } from '../types';

interface BottomMenuBarProps {
  activeTab: BottomTab;
  onSelectTab: (tab: BottomTab) => void;
  hasUnreadNotifications?: boolean;
  isAdmin?: boolean;
  profileImage?: string;
  className?: string;
}

export const BottomMenuBar: React.FC<BottomMenuBarProps> = ({
  activeTab,
  onSelectTab,
  hasUnreadNotifications = true,
  isAdmin = false,
  profileImage,
  className,
}) => {
  const isChatActive = activeTab === 'chats';
  const isFriendsActive = activeTab === 'friends';
  const isNotifActive = activeTab === 'notifications';
  const isMarketActive = activeTab === 'market';
  const isSettingsActive = activeTab === 'settings';
  const isAdminActive = activeTab === 'admin';

  return (
    <nav
      id="bottom-menu-bar"
      aria-label="Main Navigation"
      className={
        className ??
        'sticky bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-sm'
      }
    >
      <div className="w-full max-w-sm mx-auto flex items-center justify-around px-6 py-1.5">
        {/* Chat Icon */}
        <button
          id="bottom-tab-chats"
          type="button"
          onClick={() => onSelectTab('chats')}
          aria-label="Chats"
          aria-current={isChatActive ? 'page' : undefined}
          title="Chats"
          className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <MessageCircleMore
            className={`w-5 h-5 text-black transition-transform ${
              isChatActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
            }`}
          />
        </button>

        {/* Friends Icon */}
        <button
          id="bottom-tab-friends"
          type="button"
          onClick={() => onSelectTab('friends')}
          aria-label="Friends"
          aria-current={isFriendsActive ? 'page' : undefined}
          title="Friends"
          className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <Users
            className={`w-5 h-5 text-black transition-transform ${
              isFriendsActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
            }`}
          />
        </button>

        {/* Market Icon */}
        <button
          id="bottom-tab-market"
          type="button"
          onClick={() => onSelectTab('market')}
          aria-label="Market"
          aria-current={isMarketActive ? 'page' : undefined}
          title="Market"
          className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <Store
            className={`w-5 h-5 text-black transition-transform ${
              isMarketActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
            }`}
          />
        </button>

        {/* Notification Bell Icon */}
        <button
          id="bottom-tab-notifications"
          type="button"
          onClick={() => onSelectTab('notifications')}
          aria-label="Notifications"
          aria-current={isNotifActive ? 'page' : undefined}
          title="Notifications"
          className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          <Bell
            className={`w-5 h-5 text-black transition-transform ${
              isNotifActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
            }`}
          />
          {hasUnreadNotifications && !isNotifActive && (
            <span
              id="notifications-indicator-dot"
              className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 ring-2 ring-white"
            />
          )}
        </button>


        {/* Admin Icon */}
        {isAdmin && (
          <button
            id="bottom-tab-admin"
            type="button"
            onClick={() => onSelectTab('admin')}
            aria-label="Admin"
            aria-current={isAdminActive ? 'page' : undefined}
            title="Admin"
            className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
          >
            <ShieldAlert
              className={`w-5 h-5 text-rose-600 transition-transform ${
                isAdminActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
              }`}
            />
          </button>
        )}

        {/* User / Profile Icon */}
        <button
          id="bottom-tab-profile"
          type="button"
          onClick={() => onSelectTab('settings')}
          aria-label="Profile"
          aria-current={isSettingsActive ? 'page' : undefined}
          title="Profile"
          className="relative p-2 rounded-full text-black hover:bg-neutral-100/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
        >
          {profileImage ? (
            <div className={`w-6 h-6 rounded-full overflow-hidden border-2 transition-all ${isSettingsActive ? 'border-neutral-900 scale-110 shadow-sm' : 'border-transparent'}`}>
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ) : (
            <User
              className={`w-5 h-5 text-black transition-transform ${
                isSettingsActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.9px] hover:scale-105'
              }`}
            />
          )}
        </button>
      </div>
    </nav>
  );
};



