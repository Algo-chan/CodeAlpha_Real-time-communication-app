import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { Copy, Shield, ShieldAlert, Sparkles, Check } from 'lucide-react'
import { VideoGrid } from '../components/room/VideoGrid'
import { ControlBar } from '../components/room/ControlBar'
import { SidePanel } from '../components/room/SidePanel'
import { Whiteboard } from '../components/whiteboard/Whiteboard'
import { useRoomStore } from '../store/room.store'
import { useMediaStore } from '../store/media.store'
import { useWebRTC } from '../hooks/useWebRTC'
import { useScreenShare } from '../hooks/useScreenShare'
import { useToast } from '../components/ui'

export function Room() {
  const { id: shortId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()

  const [socket, setSocket] = useState(null)
  const [isCopied, setIsCopied] = useState(false)
  const [initialWhiteboardData, setInitialWhiteboardData] = useState(null)

  const {
    setRoom,
    setSelf,
    updatePeer,
    addMessage,
    setMessages,
    setTypingUser,
    addFile,
    isWhiteboardOpen,
    resetRoom,
    room,
    self,
  } = useRoomStore()

  const {
    isAudioEnabled,
    isVideoEnabled,
    setAudioEnabled,
    stopLocalStream,
  } = useMediaStore()

  // Retrieve joinToken and participant data passed from PreJoin
  const joinToken = location.state?.joinToken
  const initialParticipant = location.state?.participant

  // Connect Socket.io client
  useEffect(() => {
    if (!joinToken) {
      // Missing auth or token — redirect back to pre-join lobby
      navigate(`/join/${shortId}`, { replace: true })
      return
    }

    const newSocket = io({
      auth: { token: joinToken },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    })

    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('[Socket] Connected to signaling gateway:', newSocket.id)
      newSocket.emit('join-room', {
        roomId: shortId,
        isAudioEnabled,
        isVideoEnabled,
      })
    })

    newSocket.on('connect_error', (err) => {
      console.error('[Socket Connect Error]:', err.message)
      toast.error('Connection to signaling gateway failed.')
    })

    newSocket.on('room-error', ({ message }) => {
      toast.error(message || 'Room error')
      navigate('/dashboard')
    })

    newSocket.on('room-joined', ({ room: r, self: s, whiteboardState }) => {
      setRoom(r)
      setSelf(s)
      setInitialWhiteboardData(whiteboardState)
      toast.success(`Connected to ${r.name}`)
    })

    // Chat events
    newSocket.on('chat:message', (message) => {
      addMessage(message)
    })

    newSocket.on('chat:history', ({ messages }) => {
      setMessages(messages)
    })

    newSocket.on('chat:typing-changed', (typingInfo) => {
      setTypingUser(typingInfo)
    })

    // Files events
    newSocket.on('file:uploaded', (fileRecord) => {
      addFile(fileRecord)
      toast.info(`New file shared: ${fileRecord.originalName}`)
    })

    // Peer Media updates
    newSocket.on('peer-media-state-changed', ({ socketId, isAudioEnabled, isVideoEnabled }) => {
      updatePeer(socketId, { isAudioEnabled, isVideoEnabled })
    })

    newSocket.on('peer-screen-share-changed', ({ socketId, isSharingScreen }) => {
      updatePeer(socketId, { isSharingScreen })
    })

    newSocket.on('peer-hand-raise-changed', ({ socketId, displayName, isHandRaised }) => {
      updatePeer(socketId, { isHandRaised })
      if (isHandRaised) {
        toast.info(`${displayName} raised their hand ✋`)
      }
    })

    // Host Action: Force Mute
    newSocket.on('host-action-mute', () => {
      setAudioEnabled(false)
      toast.warning('You have been muted by the host.')
    })

    // Host Action: Removed from room
    newSocket.on('host-action-removed', () => {
      toast.error('You were removed from the meeting by the host.')
      handleLeave()
    })

    // Room locked
    newSocket.on('room-lock-changed', ({ isLocked }) => {
      toast.info(isLocked ? 'Room has been locked by the host' : 'Room is now unlocked')
    })

    // Request initial chat history
    newSocket.emit('chat:get-history')

    return () => {
      newSocket.disconnect()
      resetRoom()
    }
  }, [joinToken, shortId])

  // Initialize WebRTC Mesh
  const { replaceVideoTrack } = useWebRTC(socket)

  // Initialize Screen Sharing
  const { toggleScreenShare, screenStream, stopScreenShare } = useScreenShare(
    socket,
    replaceVideoTrack
  )

  // Leave room handler
  const handleLeave = useCallback(() => {
    stopScreenShare()
    stopLocalStream()
    socket?.emit('leave-room')
    socket?.disconnect()
    resetRoom()
    navigate('/dashboard')
  }, [socket, stopScreenShare, stopLocalStream, resetRoom, navigate])

  const copyRoomCode = () => {
    navigator.clipboard.writeText(window.location.href)
    setIsCopied(true)
    toast.success('Room link copied to clipboard')
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden flex flex-col select-none">
      {/* Top Header Overlay Bar */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="glass-toolbar rounded-pill px-3.5 py-1.5 flex items-center gap-2 text-white shadow-md">
            <span className="w-2 h-2 rounded-full bg-system-success animate-pulse" />
            <span className="text-subheadline font-semibold truncate max-w-[200px]">
              {room?.name || 'Meeting'}
            </span>
            <span className="text-separator/60">|</span>
            <button
              onClick={copyRoomCode}
              className="text-caption-1 font-mono text-white/80 hover:text-white flex items-center gap-1 transition-colors"
              title="Copy room link"
            >
              <span>{shortId}</span>
              {isCopied ? <Check className="w-3 h-3 text-system-success" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {room?.isLocked && (
            <div className="glass-toolbar rounded-pill px-2.5 py-1 text-caption-1 text-amber-400 font-medium flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Locked</span>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex">
        <div className="flex-1 w-full h-full relative overflow-hidden">
          {isWhiteboardOpen ? (
            <Whiteboard socket={socket} initialData={initialWhiteboardData} />
          ) : (
            <VideoGrid screenStream={screenStream} />
          )}
        </div>

        {/* Right Side Panel (Chat | Files | People) */}
        <SidePanel socket={socket} roomId={shortId} />
      </main>

      {/* Bottom Floating Control Bar */}
      <ControlBar
        onToggleScreenShare={toggleScreenShare}
        onLeaveRoom={handleLeave}
        socket={socket}
      />
    </div>
  )
}
