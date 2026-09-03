import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  MoreVertical,
  User,
  Trash2,
  Ban,
  ShieldCheck,
  Flag,
  Smile,
  Paperclip,
  Video,
} from 'lucide-react';
import { Contact } from '../types';
import { ViewContactModal } from './ViewContactModal';
import { ReportContactModal } from './ReportContactModal';
import { ClearChatModal } from './ClearChatModal';
import { MessageBubble } from './MessageBubble';
import { MediaViewerModal } from './MediaViewerModal';
import { EmojiPicker } from './EmojiPicker';
import { MediaAttachmentMenu } from './MediaAttachmentMenu';

interface ChatConversationProps {
  contact: Contact;
  onBack: () => void;
  onSendMessage: (
    contactId: string,
    content: { text?: string; imageUrl?: string; videoUrl?: string }
  ) => void;
  onToggleLikeMessage: (contactId: string, messageId: string) => void;
  onEditMessage: (contactId: string, messageId: string, newText: string) => void;
  onDeleteMessage: (contactId: string, messageId: string) => void;
  onClearConversation: (contactId: string) => void;
  onToggleBlockContact: (contactId: string) => void;
  onReportContact?: (contactId: string, reason: string, details: string) => void;
  onStartVideoCall: (contactId: string) => void;
}

export const ChatConversation: React.FC<ChatConversationProps> = ({
  contact,
  onBack,
  onSendMessage,
  onToggleLikeMessage,
  onEditMessage,
  onDeleteMessage,
  onClearConversation,
  onToggleBlockContact,
  onReportContact,
  onStartVideoCall,
}) => {
  const [inputText, setInputText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isViewContactOpen, setIsViewContactOpen] = useState(false);
  const [isClearChatOpen, setIsClearChatOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Emojis & Media attachments state
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);

  // Full screen media viewer state
  const [activeMedia, setActiveMedia] = useState<{
    type: 'image' | 'video' | null;
    url: string | null;
    caption?: string;
  }>({
    type: null,
    url: null,
    caption: undefined,
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 2600);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [contact.messages]);

  // Close 3-dot menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSendText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (contact.isBlocked) return;
    const trimmed = inputText.trim();
    if (!trimmed) return;

    onSendMessage(contact.id, { text: trimmed });
    setInputText('');
    setIsEmojiPickerOpen(false);
  };

  const handleSendImage = (imageUrl: string, caption?: string) => {
    if (contact.isBlocked) return;
    onSendMessage(contact.id, { imageUrl, text: caption || undefined });
    showToast('Photo sent');
  };

  const handleSendVideo = (videoUrl: string, caption?: string) => {
    if (contact.isBlocked) return;
    onSendMessage(contact.id, { videoUrl, text: caption || undefined });
    showToast('Video sent');
  };

  const handleSelectEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  const handleShare = (textToShare: string) => {
    if (navigator.clipboard && textToShare) {
      navigator.clipboard.writeText(textToShare);
      showToast('Copied to clipboard');
    } else if (textToShare) {
      showToast('Shared');
    }
  };

  const handleOpenMedia = (type: 'image' | 'video', url: string, caption?: string) => {
    setActiveMedia({ type, url, caption });
  };

  const handleCloseMedia = () => {
    setActiveMedia({ type: null, url: null, caption: undefined });
  };

  const handleToggleBlock = () => {
    onToggleBlockContact(contact.id);
    showToast(contact.isBlocked ? `Unblocked ${contact.name}` : `Blocked ${contact.name}`);
  };

  const handleClearMessages = () => {
    onClearConversation(contact.id);
    showToast(`Conversation with ${contact.name} cleared`);
  };

  const handleReportSubmit = (reason: string, details: string) => {
    if (onReportContact) {
      onReportContact(contact.id, reason, details);
    }
    showToast('Report received. Thank you for reporting.');
  };

  return (
    <div
      id="chat-conversation-screen"
      className="flex flex-col h-screen w-full bg-white max-w-2xl mx-auto relative"
    >
      {/* Toast Notification */}
      {feedbackToast && (
        <div
          id="conversation-toast"
          className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-neutral-900 text-white text-xs font-medium px-4 py-2 rounded-full shadow-lg transition-all animate-in fade-in zoom-in-95 duration-150"
        >
          {feedbackToast}
        </div>
      )}

      {/* Top Contact Bar with 3-Dot Menu */}
      <header
        id="chat-contact-bar"
        className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-white sticky top-0 z-20"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            id="chat-back-button"
            type="button"
            onClick={onBack}
            aria-label="Back to contacts"
            title="Back to contacts"
            className="flex items-center gap-1 p-2 -ml-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
          </button>

          {/* Contact Info (Click to view contact modal) */}
          <button
            id="header-contact-info-button"
            type="button"
            onClick={() => setIsViewContactOpen(true)}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200 flex items-center justify-center text-xs font-semibold group-hover:border-neutral-400 transition-colors">
                {contact.avatarText}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  contact.status === 'online' ? 'bg-emerald-500' : 'bg-neutral-300'
                }`}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 id="chat-contact-name" className="text-sm font-semibold text-neutral-900 truncate">
                  {contact.name}
                </h2>
                {contact.isBlocked && (
                  <span
                    id="header-blocked-badge"
                    className="text-[10px] uppercase font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200"
                  >
                    Blocked
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 truncate">
                {contact.isBlocked
                  ? 'Contact is blocked'
                  : contact.status === 'online'
                  ? 'Online'
                  : contact.lastSeen
                  ? `Last seen ${contact.lastSeen}`
                  : 'Offline'}
              </p>
            </div>
          </button>
        </div>

        {/* Header Action Buttons (Video Call & 3-Dot Menu) */}
        <div className="relative flex items-center gap-1" ref={menuRef}>
          {/* Outgoing Video Call Button */}
          <button
            id="chat-video-call-button"
            type="button"
            onClick={() => onStartVideoCall(contact.id)}
            disabled={contact.isBlocked}
            aria-label={`Start video call with ${contact.name}`}
            title={contact.isBlocked ? 'Cannot call blocked contact' : `Start video call with ${contact.name}`}
            className="p-2 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-full transition-colors"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            id="chat-three-dot-menu-button"
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="More options"
            aria-expanded={isMenuOpen}
            className={`p-2 rounded-full transition-colors ${
              isMenuOpen
                ? 'bg-neutral-100 text-neutral-900'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* 3-Dot Dropdown Menu */}
          {isMenuOpen && (
            <div
              id="chat-three-dot-dropdown"
              className="absolute right-0 top-full mt-1.5 w-56 rounded-xl bg-white border border-neutral-200 shadow-xl py-1.5 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
            >
              {/* View Contact */}
              <button
                id="menu-item-view-contact"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsViewContactOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
              >
                <User className="w-4 h-4 text-neutral-500" />
                <span>View contact</span>
              </button>

              {/* Clear all conversations */}
              <button
                id="menu-item-clear-conversations"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsClearChatOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4 text-neutral-500" />
                <span>Clear all conversations</span>
              </button>

              <div className="my-1 border-t border-neutral-100" />

              {/* Block and unblock contact */}
              <button
                id="menu-item-toggle-block"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleToggleBlock();
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  contact.isBlocked
                    ? 'text-neutral-800 hover:bg-neutral-50'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                {contact.isBlocked ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Unblock contact</span>
                  </>
                ) : (
                  <>
                    <Ban className="w-4 h-4 text-rose-500" />
                    <span>Block contact</span>
                  </>
                )}
              </button>

              {/* Report contact show options */}
              <button
                id="menu-item-report-contact"
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsReportOpen(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <Flag className="w-4 h-4 text-rose-500" />
                <span>Report contact</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Message Stream */}
      <div
        id="chat-messages-container"
        className="flex-1 overflow-y-auto px-4 py-6 space-y-2 bg-neutral-50/50"
      >
        {contact.messages.length === 0 ? (
          <div
            id="empty-chat-state"
            className="flex flex-col items-center justify-center h-full py-16 text-center text-neutral-400"
          >
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-2">
              <User className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-neutral-600">No messages yet</p>
            <p className="text-xs text-neutral-400 mt-1">
              {contact.isBlocked
                ? 'You blocked this contact.'
                : `Send a message or media to start chatting with ${contact.name}.`}
            </p>
          </div>
        ) : (
          contact.messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onToggleLike={(messageId) => onToggleLikeMessage(contact.id, messageId)}
              onEditMessage={(messageId, newText) => onEditMessage(contact.id, messageId, newText)}
              onDeleteMessage={(messageId) => onDeleteMessage(contact.id, messageId)}
              onShareMessage={handleShare}
              onOpenMedia={handleOpenMedia}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Docked Input Box with Emoji and Media buttons */}
      <div
        id="bottom-input-container"
        className="sticky bottom-0 inset-x-0 z-30 bg-white border-t border-neutral-200 p-3 relative shadow-xs"
      >
        {/* Emoji Picker Popover */}
        <EmojiPicker
          isOpen={isEmojiPickerOpen}
          onClose={() => setIsEmojiPickerOpen(false)}
          onSelectEmoji={handleSelectEmoji}
        />

        {/* Media Attachment Popover */}
        <MediaAttachmentMenu
          isOpen={isAttachmentOpen}
          onClose={() => setIsAttachmentOpen(false)}
          onSendImage={handleSendImage}
          onSendVideo={handleSendVideo}
        />

        {contact.isBlocked ? (
          <div
            id="blocked-contact-bar"
            className="flex items-center justify-between gap-3 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800"
          >
            <span className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>You blocked this contact. Unblock to send messages.</span>
            </span>
            <button
              id="unblock-inline-button"
              type="button"
              onClick={handleToggleBlock}
              className="px-3 py-1 font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex-shrink-0"
            >
              Unblock
            </button>
          </div>
        ) : (
          <form
            id="chat-input-form"
            onSubmit={handleSendText}
            className="flex items-center gap-2"
          >
            {/* Emoji toggle button */}
            <button
              id="emoji-picker-toggle-button"
              type="button"
              onClick={() => {
                setIsEmojiPickerOpen((prev) => !prev);
                setIsAttachmentOpen(false);
              }}
              aria-label="Insert Emoji"
              className={`p-2.5 rounded-xl transition-colors ${
                isEmojiPickerOpen
                  ? 'bg-neutral-200 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Media Attachment toggle button */}
            <button
              id="media-attachment-toggle-button"
              type="button"
              onClick={() => {
                setIsAttachmentOpen((prev) => !prev);
                setIsEmojiPickerOpen(false);
              }}
              aria-label="Attach Photo or Video"
              className={`p-2.5 rounded-xl transition-colors ${
                isAttachmentOpen
                  ? 'bg-neutral-200 text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Main Text Input */}
            <input
              ref={inputRef}
              id="chat-text-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${contact.name}...`}
              className="flex-1 px-4 py-2.5 text-sm bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
            />

            {/* Send button */}
            <button
              id="chat-send-button"
              type="submit"
              disabled={!inputText.trim()}
              aria-label="Send message"
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Full Screen Media Viewer Modal (Images & Videos) */}
      <MediaViewerModal
        isOpen={activeMedia.type !== null && activeMedia.url !== null}
        onClose={handleCloseMedia}
        mediaType={activeMedia.type}
        mediaUrl={activeMedia.url}
        caption={activeMedia.caption}
      />

      {/* Feature Modals */}
      <ViewContactModal
        contact={contact}
        isOpen={isViewContactOpen}
        onClose={() => setIsViewContactOpen(false)}
        onToggleBlock={handleToggleBlock}
      />

      <ClearChatModal
        contact={contact}
        isOpen={isClearChatOpen}
        onClose={() => setIsClearChatOpen(false)}
        onConfirmClear={handleClearMessages}
      />

      <ReportContactModal
        contact={contact}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitReport={handleReportSubmit}
      />
    </div>
  );
};
