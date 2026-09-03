import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  RefreshCw,
  Maximize,
  Volume2,
  VolumeX,
  Sparkles,
  User,
} from 'lucide-react';
import { Contact, CallStatus } from '../types';
import { callAudio } from '../utils/callAudio';

interface VideoCallModalProps {
  contact: Contact;
  isOpen: boolean;
  status: CallStatus;
  direction: 'outgoing' | 'incoming';
  onEndCall: () => void;
  onConnected?: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({
  contact,
  isOpen,
  status,
  direction,
  onEndCall,
  onConnected,
}) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false); // Swap main view & PiP
  const [hasWebcam, setHasWebcam] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const userVideoRef = useRef<HTMLVideoElement>(null);
  const contactVideoRef = useRef<HTMLVideoElement>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize and manage user's live webcam video
  useEffect(() => {
    let active = true;

    async function initUserMedia() {
      if (!isOpen) return;

      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 640 },
              height: { ideal: 480 },
            },
            audio: true,
          });

          if (!active) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          userStreamRef.current = stream;
          setHasWebcam(true);
          setCameraError(null);

          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
            userVideoRef.current.play().catch(() => {});
          }
        } else {
          setHasWebcam(false);
        }
      } catch (err) {
        console.warn('Webcam permission not granted or unavailable:', err);
        setHasWebcam(false);
        setCameraError('Camera access unavailable. Using simulated live feed.');
      }
    }

    if (isOpen) {
      initUserMedia();
    }

    return () => {
      active = false;
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => track.stop());
        userStreamRef.current = null;
      }
    };
  }, [isOpen]);

  // Ensure user video element is updated when swapped or mounted
  useEffect(() => {
    if (userVideoRef.current && userStreamRef.current) {
      userVideoRef.current.srcObject = userStreamRef.current;
      userVideoRef.current.play().catch(() => {});
    }
  }, [isSwapped, hasWebcam]);

  // Handle Outgoing Ringing & Connection transition
  useEffect(() => {
    if (!isOpen) return;

    if (status === 'outgoing') {
      callAudio.startOutgoingRingtone();
      // Auto answer after 3.5s for seamless interactive experience
      const answerTimer = setTimeout(() => {
        if (onConnected) {
          callAudio.playConnectSound();
          onConnected();
        }
      }, 3500);

      return () => {
        clearTimeout(answerTimer);
        callAudio.stopRingtone();
      };
    } else if (status === 'connected') {
      callAudio.stopRingtone();
      // Start call duration timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
    }
  }, [isOpen, status, onConnected]);

  // Reset duration when closed
  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setIsSwapped(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle Microphone
  const toggleMic = () => {
    if (userStreamRef.current) {
      const audioTracks = userStreamRef.current.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsMicMuted((prev) => !prev);
  };

  // Toggle Video / Camera
  const toggleVideo = () => {
    if (userStreamRef.current) {
      const videoTracks = userStreamRef.current.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff((prev) => !prev);
  };

  // Format call duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Contact video URL (fallback sample clip)
  const contactVideoUrl =
    contact.videoStreamUrl ||
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  return (
    <div
      id="video-call-screen"
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white overflow-hidden select-none animate-in fade-in duration-200"
    >
      {/* Top Header Information Overlay */}
      <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center font-bold text-sm text-white">
            {contact.avatarText}
          </div>
          <div>
            <h2 id="video-call-contact-name" className="text-base font-semibold text-white tracking-wide">
              {contact.name}
            </h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span id="call-status-indicator" className="text-xs text-neutral-300">
                {status === 'outgoing'
                  ? 'Calling...'
                  : status === 'connected'
                  ? formatDuration(callDuration)
                  : 'Connecting...'}
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                HD Live
              </span>
            </div>
          </div>
        </div>

        {/* Quick controls top-right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSwapped((s) => !s)}
            title="Swap Camera View"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsSpeakerMuted((s) => !s)}
            title={isSpeakerMuted ? 'Unmute Contact' : 'Mute Contact Audio'}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white transition-colors"
          >
            {isSpeakerMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Center Video Area */}
      <div className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden bg-black">
        {/* If swapped: Main screen shows User Live, else shows Contact Live */}
        {!isSwapped ? (
          /* Main: Contact Live Stream */
          <div className="relative w-full h-full flex items-center justify-center">
            {status === 'outgoing' ? (
              <div className="flex flex-col items-center justify-center text-center p-6 animate-pulse">
                <div className="relative mb-6">
                  <div className="w-28 h-28 rounded-full bg-neutral-800 border-2 border-white/20 flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
                    {contact.avatarText}
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping" />
                </div>
                <p className="text-xl font-semibold text-white">Calling {contact.name}...</p>
                <p className="text-xs text-neutral-400 mt-2">Connecting secure peer video...</p>
              </div>
            ) : (
              <video
                ref={contactVideoRef}
                id="contact-live-video"
                src={contactVideoUrl}
                autoPlay
                loop
                muted={isSpeakerMuted}
                playsInline
                className="w-full h-full object-cover sm:object-contain"
              />
            )}

            {/* Contact Live Label */}
            <div className="absolute bottom-28 left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-white">{contact.name} (Live)</span>
            </div>
          </div>
        ) : (
          /* Main: User Live Stream (When swapped) */
          <div className="relative w-full h-full flex items-center justify-center bg-neutral-900">
            {hasWebcam && !isVideoOff ? (
              <video
                ref={userVideoRef}
                id="user-live-video-main"
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
            ) : (
              /* Simulated Live User Feed if camera disabled or not available */
              <div className="flex flex-col items-center justify-center text-center p-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 border-2 border-white/20 flex items-center justify-center text-2xl font-bold mb-4 shadow-xl">
                  YOU
                </div>
                <p className="text-sm font-medium text-white">Your Camera is Off</p>
                <p className="text-xs text-neutral-400 mt-1">Tap camera button to turn on</p>
              </div>
            )}

            <div className="absolute bottom-28 left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-white">You (Live)</span>
            </div>
          </div>
        )}

        {/* Picture-in-Picture (PiP) Window in corner - Click to swap! */}
        <div
          id="pip-video-container"
          onClick={() => setIsSwapped((s) => !s)}
          title="Click to swap views"
          className="absolute top-20 right-4 sm:top-24 sm:right-6 z-30 w-32 h-44 sm:w-40 sm:h-56 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-neutral-900 cursor-pointer hover:border-white transition-all hover:scale-105 group"
        >
          {/* If swapped: PiP shows Contact; otherwise PiP shows User live camera! */}
          {isSwapped ? (
            /* PiP: Contact */
            <div className="relative w-full h-full bg-neutral-900">
              <video
                src={contactVideoUrl}
                autoPlay
                loop
                muted={isSpeakerMuted}
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">
                {contact.name}
              </div>
            </div>
          ) : (
            /* PiP: User Live Camera */
            <div className="relative w-full h-full bg-neutral-900 flex items-center justify-center">
              {hasWebcam && !isVideoOff ? (
                <video
                  ref={userVideoRef}
                  id="user-live-video-pip"
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/20 flex items-center justify-center text-xs font-bold text-white mb-1">
                    YOU
                  </div>
                  <span className="text-[10px] text-neutral-300">
                    {isVideoOff ? 'Camera Off' : 'Live Self'}
                  </span>
                </div>
              )}

              {/* PiP Badge */}
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>You</span>
              </div>

              {/* Hover swap icon */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* In-Call Controls Dock */}
      <div
        id="video-call-controls-bar"
        className="absolute bottom-0 inset-x-0 z-30 pb-8 pt-4 px-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col items-center gap-3"
      >
        <div className="flex items-center justify-center gap-4 sm:gap-6 bg-neutral-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-neutral-700 shadow-2xl">
          {/* Mute/Unmute Mic */}
          <button
            id="toggle-mic-button"
            type="button"
            onClick={toggleMic}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isMicMuted
                ? 'bg-rose-600/90 text-white'
                : 'bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white'
            }`}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Turn Camera On/Off */}
          <button
            id="toggle-camera-button"
            type="button"
            onClick={toggleVideo}
            title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 ${
              isVideoOff
                ? 'bg-rose-600/90 text-white'
                : 'bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white'
            }`}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <VideoIcon className="w-5 h-5" />}
          </button>

          {/* Swap View Button */}
          <button
            id="swap-screens-button"
            type="button"
            onClick={() => setIsSwapped((s) => !s)}
            title="Swap Self and Contact Views"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 hover:text-white flex items-center justify-center transition-all active:scale-95"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            id="end-call-button"
            type="button"
            onClick={() => {
              callAudio.playEndSound();
              onEndCall();
            }}
            title="End Call"
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-transform"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
