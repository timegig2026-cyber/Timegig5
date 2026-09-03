import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, RotateCcw, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: 'image' | 'video' | null;
  mediaUrl: string | null;
  caption?: string;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  caption,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Reset state whenever modal opens
    if (isOpen) {
      setIsPlaying(true);
      setZoomLevel(1);
    }
  }, [isOpen, mediaUrl]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mediaUrl || !mediaType) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      id="fullscreen-media-viewer"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 text-white animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar with actions and close */}
      <div
        className="w-full flex items-center justify-between px-6 py-4 z-10 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 bg-white/10 px-2.5 py-1 rounded-full">
            {mediaType === 'image' ? 'Image Viewer' : 'Video Player'}
          </span>
          {caption && (
            <p className="text-sm text-neutral-200 truncate max-w-md hidden sm:block">
              {caption}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {mediaType === 'image' && (
            <>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
                title="Zoom Out"
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
                title="Zoom In"
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </>
          )}

          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            title="Download Media"
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Download className="w-5 h-5" />
          </a>

          <button
            id="close-fullscreen-media-button"
            type="button"
            onClick={onClose}
            aria-label="Close full screen"
            className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors ml-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Media Center Content */}
      <div
        className="flex-1 w-full flex items-center justify-center p-4 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {mediaType === 'image' ? (
          <img
            id="fullscreen-image-element"
            src={mediaUrl}
            alt={caption || 'Full screen image'}
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            style={{ transform: `scale(${zoomLevel})` }}
            className="max-h-[85vh] max-w-[90vw] object-contain select-none transition-transform duration-150 rounded-lg shadow-2xl"
          />
        ) : (
          <div className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center">
            <video
              id="fullscreen-video-element"
              ref={videoRef}
              src={mediaUrl}
              autoPlay
              playsInline
              onClick={togglePlay}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              className="max-h-[80vh] max-w-[90vw] rounded-xl object-contain shadow-2xl cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Bottom Bar Controls for Video */}
      {mediaType === 'video' && (
        <div
          className="w-full max-w-3xl px-6 py-4 z-10 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress / Seek bar */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-mono w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 accent-white h-1.5 bg-neutral-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs text-neutral-400 font-mono w-10">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="p-2.5 bg-white text-black hover:bg-neutral-200 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                title="Restart"
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
                className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            {caption && (
              <p className="text-xs text-neutral-300 italic truncate max-w-xs">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Caption for Image */}
      {mediaType === 'image' && caption && (
        <div
          className="w-full text-center pb-6 z-10 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="bg-black/60 backdrop-blur-xs text-sm text-neutral-200 px-4 py-2 rounded-full border border-white/10">
            {caption}
          </span>
        </div>
      )}
    </div>
  );
};
