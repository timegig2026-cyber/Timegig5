import React, { useRef } from 'react';
import { Image, Video, X } from 'lucide-react';

interface MediaAttachmentMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSendImage: (imageUrl: string, caption?: string) => void;
  onSendVideo: (videoUrl: string, caption?: string) => void;
}

const SAMPLE_PHOTOS = [
  {
    name: 'Coffee & Laptop',
    url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mountain Sunset',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Urban Architecture',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
];

const SAMPLE_VIDEOS = [
  {
    name: 'Short Demo Clip',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  },
  {
    name: 'Animated Reel',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  },
];

export const MediaAttachmentMenu: React.FC<MediaAttachmentMenuProps> = ({
  isOpen,
  onClose,
  onSendImage,
  onSendVideo,
}) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onSendImage(reader.result, file.name);
          onClose();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      onSendVideo(videoUrl, file.name);
      onClose();
    }
  };

  return (
    <div
      id="media-attachment-popover"
      className="absolute bottom-16 left-12 z-40 w-80 rounded-2xl bg-white border border-neutral-200 shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFileChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoFileChange}
      />

      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-3">
        <span className="text-xs font-semibold text-neutral-800">Send Media</span>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Upload Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          id="upload-image-button"
          type="button"
          onClick={() => imageInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all text-neutral-700 group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Image className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Upload Photo</span>
        </button>

        <button
          id="upload-video-button"
          type="button"
          onClick={() => videoInputRef.current?.click()}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 transition-all text-neutral-700 group"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <Video className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Upload Video</span>
        </button>
      </div>

      {/* Quick Sample Media to easily test without local files */}
      <div className="space-y-2">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
          Quick Sample Media
        </span>
        <div className="space-y-1">
          {SAMPLE_PHOTOS.map((photo) => (
            <button
              key={photo.name}
              type="button"
              onClick={() => {
                onSendImage(photo.url, photo.name);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <Image className="w-3.5 h-3.5 text-emerald-600" />
                <span>{photo.name}</span>
              </span>
              <span className="text-[10px] text-neutral-400">Photo</span>
            </button>
          ))}
          {SAMPLE_VIDEOS.map((vid) => (
            <button
              key={vid.name}
              type="button"
              onClick={() => {
                onSendVideo(vid.url, vid.name);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2 rounded-lg text-xs text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
            >
              <span className="flex items-center gap-2">
                <Video className="w-3.5 h-3.5 text-indigo-600" />
                <span>{vid.name}</span>
              </span>
              <span className="text-[10px] text-neutral-400">Video</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
