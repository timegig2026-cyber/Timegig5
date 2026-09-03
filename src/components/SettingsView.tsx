import React, { useState } from 'react';
import {
  Bell,
  Video,
  Shield,
  Smartphone,
  HelpCircle,
  ChevronRight,
  User,
  Volume2,
  Check,
} from 'lucide-react';

interface SettingsViewProps {
  onResetData?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetData }) => {
  const [notifications, setNotifications] = useState(true);
  const [callSounds, setCallSounds] = useState(true);
  const [hdVideo, setHdVideo] = useState(true);
  const [copied, setCopied] = useState(false);

  return (
    <div id="settings-view-container" className="flex-1 flex flex-col bg-neutral-50 overflow-y-auto">
      {/* Header */}
      <header className="px-6 pt-6 pb-4 border-b border-neutral-200 bg-white">
        <h1 id="settings-title" className="text-xl font-bold text-neutral-900 tracking-tight">
          Settings
        </h1>
      </header>

      <div className="p-6 space-y-6 max-w-lg mx-auto w-full">
        {/* User Profile Card */}
        <div
          id="user-profile-card"
          className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs"
        >
          <div className="w-14 h-14 rounded-full bg-emerald-700 text-white flex items-center justify-center text-lg font-bold shadow-xs">
            YOU
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-neutral-900 truncate">Alex Morgan</h2>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Online • Available
            </p>
            <p className="text-xs text-neutral-400 mt-0.5 truncate">alex.morgan@workspace.io</p>
          </div>
        </div>

        {/* Call & Video Preferences */}
        <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Audio & Video Calls
            </span>
          </div>

          <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">HD Live Video</p>
                <p className="text-xs text-neutral-500">Enable high definition camera stream</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={hdVideo}
              onChange={(e) => setHdVideo(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Ringtone & Audio Chimes</p>
                <p className="text-xs text-neutral-500">Play pleasant sound effects for call events</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={callSounds}
              onChange={(e) => setCallSounds(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
            />
          </label>
        </div>

        {/* Notifications & Privacy */}
        <div className="bg-white rounded-2xl border border-neutral-200 divide-y divide-neutral-100 overflow-hidden shadow-xs">
          <div className="px-4 py-3 bg-neutral-50/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Preferences & Security
            </span>
          </div>

          <label className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">Push Notifications</p>
                <p className="text-xs text-neutral-500">Receive alerts for new messages</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
            />
          </label>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 text-neutral-700">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">End-to-End Encryption</p>
                <p className="text-xs text-neutral-500">Messages and calls are secured</p>
              </div>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
        </div>

        {/* About info */}
        <div className="text-center py-4 text-xs text-neutral-400 space-y-1">
          <p className="font-medium text-neutral-500">Real-time Web Chat & Video Calling</p>
          <p>Version 2.4.0 • Built with React & Tailwind</p>
        </div>
      </div>
    </div>
  );
};
