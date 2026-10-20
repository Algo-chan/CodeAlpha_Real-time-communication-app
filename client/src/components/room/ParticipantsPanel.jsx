import React from 'react'
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Crown,
  UserX,
  VolumeX,
  Lock,
  Unlock,
} from 'lucide-react'
import { Button, Avatar, Toggle, useToast } from '../ui'
import { useRoomStore } from '../../store/room.store'
import { useMediaStore } from '../../store/media.store'

export function ParticipantsPanel({ socket }) {
  const toast = useToast()
  const { self, peers, room } = useRoomStore()
  const { isAudioEnabled, isVideoEnabled } = useMediaStore()

  const isCurrentUserHost = self?.isHost
  const peerList = Object.values(peers)

  const handleMutePeer = (targetSocketId, targetName) => {
    socket?.emit('host-mute-peer', { targetSocketId })
    toast.info(`Sent mute request to ${targetName}`)
  }

  const handleRemovePeer = (targetSocketId, targetName) => {
    socket?.emit('host-remove-peer', { targetSocketId })
    toast.info(`Removed ${targetName} from the meeting`)
  }

  const handleToggleLock = (isLocked) => {
    socket?.emit('host-lock-room', { isLocked })
    toast.info(isLocked ? 'Room has been locked' : 'Room is now unlocked')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Host Controls Banner (if self is host) */}
      {isCurrentUserHost && (
        <div className="p-4 border-b border-separator/30 bg-accent-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-subheadline font-semibold text-label">Host Controls</span>
            </div>
            <Toggle
              checked={room?.isLocked}
              onChange={handleToggleLock}
              label={room?.isLocked ? 'Locked' : 'Unlocked'}
            />
          </div>
        </div>
      )}

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Self entry */}
        <div className="glass-panel p-3 rounded-xl border border-separator/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={self?.displayName || 'You'} size="md" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-subheadline font-semibold text-label">
                  {self?.displayName || 'You'} (You)
                </span>
                {self?.isHost && (
                  <span title="Meeting Host">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  </span>
                )}
              </div>
              <p className="text-caption-1 text-label-secondary">
                {self?.isGuest ? 'Guest' : 'Authenticated User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-label-secondary">
            {isAudioEnabled ? (
              <Mic className="w-4 h-4 text-system-success" />
            ) : (
              <MicOff className="w-4 h-4 text-system-destructive" />
            )}
            {isVideoEnabled ? (
              <VideoIcon className="w-4 h-4 text-accent" />
            ) : (
              <VideoOff className="w-4 h-4 text-label-tertiary" />
            )}
          </div>
        </div>

        {/* Remote Peers */}
        {peerList.map((peer) => (
          <div
            key={peer.socketId}
            className="glass-panel p-3 rounded-xl border border-separator/30 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Avatar name={peer.displayName} size="md" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-subheadline font-semibold text-label">
                    {peer.displayName}
                  </span>
                  {peer.isHost && (
                    <span title="Meeting Host">
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                  )}
                </div>
                <p className="text-caption-1 text-label-secondary">
                  {peer.isGuest ? 'Guest' : 'Member'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-label-secondary mr-1">
                {peer.isAudioEnabled ? (
                  <Mic className="w-4 h-4 text-system-success" />
                ) : (
                  <MicOff className="w-4 h-4 text-system-destructive" />
                )}
                {peer.isVideoEnabled ? (
                  <VideoIcon className="w-4 h-4 text-accent" />
                ) : (
                  <VideoOff className="w-4 h-4 text-label-tertiary" />
                )}
              </div>

              {/* Host actions on remote peer */}
              {isCurrentUserHost && !peer.isHost && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleMutePeer(peer.socketId, peer.displayName)}
                    title={`Mute ${peer.displayName}`}
                    className="text-label-tertiary hover:text-system-destructive"
                  >
                    <VolumeX className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemovePeer(peer.socketId, peer.displayName)}
                    title={`Remove ${peer.displayName}`}
                    className="text-label-tertiary hover:text-system-destructive"
                  >
                    <UserX className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
