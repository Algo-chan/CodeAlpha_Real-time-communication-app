import { Message } from '../models/Message.js'

export const registerChatHandlers = (io, socket) => {
  // Send message
  socket.on('chat:send', async ({ content }) => {
    const roomId = socket.currentRoomId
    if (!roomId || !content || !content.trim()) return

    const trimmedContent = content.trim().slice(0, 2000)

    try {
      const msg = new Message({
        roomId,
        userId: socket.user.userId,
        displayName: socket.user.displayName,
        content: trimmedContent,
        timestamp: new Date(),
      })

      await msg.save()

      const payload = {
        id: msg._id.toString(),
        userId: msg.userId,
        displayName: msg.displayName,
        content: msg.content,
        timestamp: msg.timestamp,
        isSelf: false,
      }

      // Broadcast to all participants in room (including sender)
      io.to(roomId).emit('chat:message', payload)
    } catch (err) {
      console.error('[Chat] Failed to save message:', err)
    }
  })

  // Typing indicator
  socket.on('chat:typing', ({ isTyping }) => {
    const roomId = socket.currentRoomId
    if (!roomId) return

    socket.to(roomId).emit('chat:typing-changed', {
      userId: socket.user.userId,
      displayName: socket.user.displayName,
      isTyping: Boolean(isTyping),
    })
  })

  // Request chat history
  socket.on('chat:get-history', async () => {
    const roomId = socket.currentRoomId
    if (!roomId) return

    try {
      const messages = await Message.find({ roomId })
        .sort({ timestamp: -1 })
        .limit(50)

      socket.emit('chat:history', {
        messages: messages.reverse().map((m) => ({
          id: m._id.toString(),
          userId: m.userId,
          displayName: m.displayName,
          content: m.content,
          timestamp: m.timestamp,
        })),
      })
    } catch (err) {
      console.error('[Chat] Failed to fetch history:', err)
    }
  })
}
