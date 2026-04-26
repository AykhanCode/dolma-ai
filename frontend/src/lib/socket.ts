import { io, Socket } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    const token = localStorage.getItem('accessToken')
    socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      autoConnect: false,
    })
  }
  return socket
}

export function connectSocket(): void {
  const s = getSocket()
  if (!s.connected) {
    s.connect()
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect()
  }
}

export function joinConversation(conversationId: string): void {
  getSocket().emit('join_conversation', { conversationId })
}

export function leaveConversation(conversationId: string): void {
  getSocket().emit('leave_conversation', { conversationId })
}

export function sendSocketMessage(conversationId: string, content: string): void {
  getSocket().emit('send_message', { conversationId, content })
}

export function onNewMessage(callback: (message: unknown) => void): () => void {
  const s = getSocket()
  s.on('new_message', callback)
  return () => s.off('new_message', callback)
}

export function onTyping(callback: (data: unknown) => void): () => void {
  const s = getSocket()
  s.on('typing', callback)
  return () => s.off('typing', callback)
}
