import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  MicOff,
  Pin,
  PinOff,
  Maximize2,
  Minimize2,
  Tv2,
  Hand,
  Shield,
} from 'lucide-react'
import { Avatar } from '../ui'
import { ConnectionQuality } from './ConnectionQuality'

export function VideoTile({
  participant,
  isSelf = false,
  stream,
  isAudioEnabled = true,
  isVideoEnabled = true,
  isSharingScreen = false,
  isHandRaised = false,
  isActiveSpeaker = false,
  isPinned = false,
  onTogglePin,
  className = '',
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Attach MediaStream to video element
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream, isVideoEnabled])

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => null)
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => null)
      setIsFullscreen(false)
    }
  }

  const togglePiP = async () => {
    if (!videoRef.current) return
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture()
      }
    } catch (err) {
      console.warn('PiP not available:', err)
    }
  }

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full rounded-tile bg-neutral-900 overflow-hidden select-none border transition-all duration-200 flex items-center justify-center ${
        isActiveSpeaker
          ? 'border-accent ring-2 ring-accent/40 shadow-lg'
          : 'border-separator/20'
      } ${className}`}
    >
      {/* Live Video Element */}
      {isVideoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isSelf} // always mute self to prevent feedback echo
          className={`w-full h-full object-cover ${
            isSelf && !isSharingScreen ? '-scale-x-100' : ''
          }`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-4">
          <Avatar
            name={participant?.displayName || 'User'}
            size="2xl"
            className="shadow-md"
          />
          <p className="mt-3 text-subheadline text-white/70 font-medium">
            {participant?.displayName || 'User'}
          </p>
        </div>
      )}

      {/* Screen Sharing Badge Overlay */}
      {isSharingScreen && (
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-pill bg-accent/90 backdrop-blur-md text-white text-caption-1 font-semibold flex items-center gap-1.5 shadow-sm z-20">
          <Tv2 className="w-3.5 h-3.5" />
          <span>Screen Presentation</span>
        </div>
      )}

      {/* Hand Raised Badge */}
      {isHandRaised && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute top-3 right-3 px-2.5 py-1 rounded-pill bg-amber-500 text-white text-caption-1 font-bold flex items-center gap-1.5 shadow-md z-20"
        >
          <Hand className="w-3.5 h-3.5 animate-bounce" />
          <span>Raised Hand</span>
        </motion.div>
      )}

      {/* Hover Control Overlay (Pin, PiP, Fullscreen) */}
      <div
        className={`absolute top-3 right-3 flex items-center gap-1.5 z-20 transition-opacity duration-200 ${
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        } ${isHandRaised ? 'mr-28' : ''}`}
      >
        {onTogglePin && (
          <button
            onClick={onTogglePin}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md transition-colors"
            title={isPinned ? 'Unpin tile' : 'Pin to spotlight'}
          >
            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
          </button>
        )}

        {document.pictureInPictureEnabled && isVideoEnabled && stream && (
          <button
            onClick={togglePiP}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md transition-colors"
            title="Picture-in-Picture"
          >
            <Tv2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={toggleFullscreen}
          className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Bottom Info Bar */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-black/55 backdrop-blur-md text-white text-caption-1 font-medium max-w-[80%] truncate">
          {participant?.isHost && (
            <span title="Meeting Host">
              <Shield className="w-3 h-3 text-accent" />
            </span>
          )}
          <span className="truncate">
            {participant?.displayName || 'User'} {isSelf ? '(You)' : ''}
          </span>
          {!isAudioEnabled && (
            <span title="Microphone muted" className="text-system-destructive">
              <MicOff className="w-3 h-3" />
            </span>
          )}
        </div>

        {!isSelf && (
          <ConnectionQuality quality={participant?.connectionQuality || 'good'} />
        )}
      </div>
    </div>
  )
}
