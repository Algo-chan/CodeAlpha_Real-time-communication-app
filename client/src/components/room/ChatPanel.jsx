import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile } from 'lucide-react'
import { Button, Avatar } from '../ui'
import { useRoomStore } from '../../store/room.store'

export function ChatPanel({ socket }) {
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)
  const messagesEndRef = useRef(null)

  const { messages, self, typingUsers } = useRoomStore()

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUsers])

  const handleInputChange = (e) => {
    setInputText(e.target.value)

    if (!isTyping) {
      setIsTyping(true)
      socket?.emit('chat:typing', { isTyping: true })
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      socket?.emit('chat:typing', { isTyping: false })
    }, 1500)
  }

  const handleSendMessage = (e) => {
    e?.preventDefault()
    const content = inputText.trim()
    if (!content || !socket) return

    socket.emit('chat:send', { content })
    setInputText('')

    if (isTyping) {
      setIsTyping(false)
      socket.emit('chat:typing', { isTyping: false })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Group consecutive messages by same author within 2 minutes (iMessage style)
  const groupedMessages = messages.reduce((groups, msg, index) => {
    const prevMsg = messages[index - 1]
    const isSelf = msg.userId === self?.userId
    const isConsecutive =
      prevMsg &&
      prevMsg.userId === msg.userId &&
      new Date(msg.timestamp) - new Date(prevMsg.timestamp) < 120000

    if (isConsecutive) {
      groups[groups.length - 1].messages.push(msg)
    } else {
      groups.push({
        id: msg.id || index,
        userId: msg.userId,
        displayName: msg.displayName,
        isSelf,
        timestamp: msg.timestamp,
        messages: [msg],
      })
    }
    return groups
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupedMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-label-secondary p-4">
            <p className="text-subheadline font-medium text-label">No messages yet</p>
            <p className="text-caption-1 mt-1 text-label-tertiary">
              Send a message or greeting to start the conversation.
            </p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div
              key={group.id}
              className={`flex flex-col ${group.isSelf ? 'items-end' : 'items-start'}`}
            >
              {!group.isSelf && (
                <div className="flex items-center gap-2 mb-1 px-1">
                  <Avatar name={group.displayName} size="sm" />
                  <span className="text-caption-1 font-semibold text-label">
                    {group.displayName}
                  </span>
                </div>
              )}

              <div
                className={`flex flex-col gap-1 max-w-[85%] ${
                  group.isSelf ? 'items-end' : 'items-start'
                }`}
              >
                {group.messages.map((m, mIdx) => (
                  <div
                    key={m.id || mIdx}
                    className={`px-3.5 py-2 text-subheadline break-words rounded-2xl ${
                      group.isSelf
                        ? 'bg-accent text-white rounded-br-sm'
                        : 'bg-surface-elevated text-label rounded-bl-sm border border-separator/30'
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>

              <span className="text-[10px] text-label-tertiary mt-1 px-1">
                {new Date(group.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        <AnimatePresence>
          {typingUsers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="flex items-center gap-2 text-caption-1 text-label-secondary px-2 italic"
            >
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce [animation-delay:0.4s]" />
              </span>
              <span>
                {typingUsers.map((u) => u.displayName).join(', ')}{' '}
                {typingUsers.length === 1 ? 'is typing...' : 'are typing...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-separator/30 bg-surface/80">
        <div className="relative flex items-center rounded-pill bg-surface-elevated border border-separator/40 focus-within:ring-2 focus-within:ring-accent/30 focus-within:border-accent">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-transparent px-4 py-2.5 text-subheadline text-label placeholder:text-label-tertiary focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 mr-1 rounded-full text-accent hover:bg-accent/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
