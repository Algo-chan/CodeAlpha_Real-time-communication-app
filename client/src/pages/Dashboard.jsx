import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Video, LogIn, Sparkles, RefreshCw } from 'lucide-react'
import { Navbar } from '../components/layout/Navbar'
import { Button, Input, Modal, SkeletonCard, EmptyState, useToast } from '../components/ui'
import { RoomCard } from '../components/room/RoomCard'
import { useAuthStore } from '../store/auth.store'
import api from '../lib/api'

export function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuthStore()

  const [rooms, setRooms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [roomName, setRoomName] = useState('')
  const [roomPassword, setRoomPassword] = useState('')
  const [joinIdInput, setJoinIdInput] = useState('')

  const fetchRooms = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get('/rooms')
      setRooms(data.rooms || [])
    } catch (err) {
      toast.error('Could not load recent rooms')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!roomName.trim()) {
      toast.error('Please enter a meeting name')
      return
    }

    try {
      setIsSubmitting(true)
      const { data } = await api.post('/rooms', {
        name: roomName,
        password: roomPassword.trim() || undefined,
      })

      toast.success('Room created!')
      setIsCreateModalOpen(false)
      setRoomName('')
      setRoomPassword('')
      navigate(`/join/${data.room.shortId}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create room')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleJoinById = (e) => {
    e.preventDefault()
    const cleanId = joinIdInput.trim().toLowerCase()
    if (!cleanId) return
    navigate(`/join/${cleanId}`)
  }

  const handleDeleteRoom = async (shortId) => {
    try {
      await api.delete(`/rooms/${shortId}`)
      setRooms((prev) => prev.filter((r) => r.shortId !== shortId))
      toast.success('Room deleted')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete room')
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Header Greeting & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-separator/30">
          <div>
            <div className="inline-flex items-center gap-2 text-accent text-footnote font-medium mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Workspace</span>
            </div>
            <h1 className="text-large-title font-bold text-label">
              Welcome back, {user?.name?.split(' ')[0] || 'Friend'}
            </h1>
            <p className="text-body text-label-secondary mt-1">
              Start an instant meeting, schedule a session, or join via room code.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              leftIcon={Plus}
              onClick={() => setIsCreateModalOpen(true)}
              className="shadow-md shadow-accent/20"
            >
              New Meeting
            </Button>
          </div>
        </div>

        {/* Join With Code Bar */}
        <div className="my-8 glass-panel rounded-card p-5 border border-separator/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center text-label-secondary">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-headline font-semibold text-label">Join with Room Code</h3>
              <p className="text-caption-1 text-label-secondary">Enter a short code like abc-defg-hij to join immediately.</p>
            </div>
          </div>

          <form onSubmit={handleJoinById} className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="e.g. abc-defg-hij"
              value={joinIdInput}
              onChange={(e) => setJoinIdInput(e.target.value)}
              className="w-full sm:w-64"
            />
            <Button type="submit" variant="secondary" disabled={!joinIdInput.trim()}>
              Join
            </Button>
          </form>
        </div>

        {/* Recent Rooms Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-2 font-bold text-label">Recent Meetings</h2>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={RefreshCw}
              onClick={fetchRooms}
              className="text-label-secondary"
            >
              Refresh
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms.map((room) => (
                <RoomCard
                  key={room.shortId}
                  room={room}
                  onDelete={handleDeleteRoom}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Video}
              title="No recent meetings"
              description="Create your first room to generate an instant link you can share with your team."
              actionLabel="Start a Meeting"
              onAction={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Create Room Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Start a New Meeting"
        description="Configure your room parameters before entering the pre-join lobby."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateRoom}
              isLoading={isSubmitting}
            >
              Create & Join
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-4">
          <Input
            label="Meeting Name"
            placeholder="e.g. Design Sync & Review"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            autoFocus
          />

          <Input
            label="Room Password (Optional)"
            type="password"
            placeholder="Leave empty for public link access"
            value={roomPassword}
            onChange={(e) => setRoomPassword(e.target.value)}
          />

          <p className="text-caption-1 text-label-secondary">
            A short shareable code (e.g. <span className="font-mono text-accent">abc-defg-hij</span>) will be automatically generated.
          </p>
        </form>
      </Modal>
    </div>
  )
}
