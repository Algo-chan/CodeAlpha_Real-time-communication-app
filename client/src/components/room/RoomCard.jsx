import React from 'react'
import { Link } from 'react-router-dom'
import { Video, Lock, MoreVertical, Copy, Trash2, ArrowRight } from 'lucide-react'
import { Button, ContextMenu, useToast } from '../ui'

export function RoomCard({ room, onDelete }) {
  const toast = useToast()

  const copyRoomLink = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    const url = `${window.location.origin}/join/${room.shortId}`
    navigator.clipboard.writeText(url)
    toast.success('Room link copied to clipboard')
  }

  const menuItems = [
    {
      label: 'Copy Invitation Link',
      icon: Copy,
      onClick: copyRoomLink,
    },
    { separator: true },
    {
      label: 'Delete Room',
      icon: Trash2,
      destructive: true,
      onClick: () => onDelete && onDelete(room.shortId),
    },
  ]

  const formattedDate = new Date(room.lastActivity || room.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="glass-panel rounded-card p-5 border border-separator/40 hover:border-accent/40 transition-all duration-200 flex flex-col justify-between group shadow-sm hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-accent-muted text-accent flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-title-2 text-label font-semibold truncate max-w-[180px]">
                {room.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-caption-1 font-mono text-label-secondary bg-surface-elevated px-2 py-0.5 rounded-pill border border-separator/20">
                  {room.shortId}
                </span>
                {room.hasPassword && (
                  <span title="Password protected">
                    <Lock className="w-3.5 h-3.5 text-label-tertiary" />
                  </span>
                )}
              </div>
            </div>
          </div>

          <ContextMenu
            trigger={
              <button
                className="p-1.5 rounded-full text-label-tertiary hover:text-label hover:bg-surface-elevated transition-colors"
                aria-label="Room options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={menuItems}
          />
        </div>

        <p className="text-caption-1 text-label-secondary">
          Last active: {formattedDate}
        </p>
      </div>

      <div className="mt-5 pt-3 border-t border-separator/30 flex items-center justify-between">
        <button
          onClick={copyRoomLink}
          className="text-footnote font-medium text-accent hover:underline flex items-center gap-1"
        >
          <Copy className="w-3.5 h-3.5" />
          Copy link
        </button>

        <Link to={`/join/${room.shortId}`}>
          <Button size="sm" variant="primary" rightIcon={ArrowRight}>
            Join
          </Button>
        </Link>
      </div>
    </div>
  )
}
