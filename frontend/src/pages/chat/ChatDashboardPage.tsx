import { useState } from 'react'
import { Flag, MessageSquare, Send, User, X } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { Input } from '@/components/common/Input'
import { useConversations } from '@/hooks/useConversations'
import { CONVERSATION_STATUSES } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/formatters'
import { SkeletonLine } from '@/components/common/Spinner'
import type { Conversation, ConversationStatus } from '@/types'
import toast from 'react-hot-toast'

function getStatusVariant(status: ConversationStatus) {
  const map: Record<ConversationStatus, 'info' | 'neutral' | 'danger' | 'warning'> = {
    open: 'info', closed: 'neutral', escalated: 'danger', pending: 'warning',
  }
  return map[status]
}

export function ChatDashboardPage() {
  const {
    conversations,
    currentConversation,
    messages,
    isLoading,
    isLoadingMessages,
    setCurrentConversation,
    fetchMessages,
    sendMessage,
    escalateConversation,
    closeConversation,
    setFilters,
  } = useConversations()

  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversation(conv)
    fetchMessages(conv.id)
  }

  const handleSend = async () => {
    if (!messageInput.trim() || !currentConversation) return
    try {
      await sendMessage(currentConversation.id, messageInput.trim())
      setMessageInput('')
    } catch {
      toast.error('Failed to send message')
    }
  }

  const handleEscalate = async () => {
    if (!currentConversation) return
    try {
      await escalateConversation(currentConversation.id)
      toast.success('Conversation escalated')
    } catch {
      toast.error('Failed to escalate')
    }
  }

  const handleClose = async () => {
    if (!currentConversation) return
    try {
      await closeConversation(currentConversation.id)
      toast.success('Conversation closed')
    } catch {
      toast.error('Failed to close conversation')
    }
  }

  const filteredConversations = conversations.filter((c) =>
    !searchQuery || c.customerName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Chat Dashboard</h1>
        <div className="flex gap-2">
          {(['open', 'escalated', 'closed'] as ConversationStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => setFilters({ status })}
              className="px-3 py-1.5 text-xs rounded-full border border-neutral-200 hover:border-primary-400 transition-colors capitalize"
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 h-[calc(100vh-12rem)]">
        {/* Conversation list */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-3">
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto space-y-2">
            {isLoading ? (
              Array(5).fill(null).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 border border-neutral-200 space-y-2">
                  <SkeletonLine className="h-4 w-3/4" />
                  <SkeletonLine className="h-3 w-1/2" />
                </div>
              ))
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-sm text-neutral-500">No conversations found</div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    currentConversation?.id === conv.id
                      ? 'border-primary-400 bg-primary-light'
                      : 'border-neutral-200 bg-white hover:border-primary-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-900 truncate">
                      {conv.customerName || 'Unknown'}
                    </span>
                    <Badge variant={getStatusVariant(conv.status)} size="sm">
                      {CONVERSATION_STATUSES[conv.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-500 capitalize">{conv.channel}</span>
                    {conv.lastMessageAt && (
                      <span className="text-xs text-neutral-400">{formatRelativeTime(conv.lastMessageAt)}</span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className="text-xs text-neutral-500 truncate mt-1">{conv.lastMessage}</p>
                  )}
                  {conv.unreadCount > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-500 text-white text-xs rounded-full mt-1">
                      {conv.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main chat panel */}
        {currentConversation ? (
          <div className="flex-1 flex flex-col bg-white rounded-xl border border-neutral-200">
            {/* Chat header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary-light rounded-full flex items-center justify-center text-primary-700 font-semibold text-sm">
                  {currentConversation.customerName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{currentConversation.customerName || 'Unknown'}</p>
                  <p className="text-xs text-neutral-500 capitalize">{currentConversation.channel}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" icon={<Flag className="w-4 h-4" />} onClick={handleEscalate}>
                  Escalate
                </Button>
                <Button variant="ghost" size="sm" icon={<X className="w-4 h-4" />} onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoadingMessages ? (
                <div className="text-center text-sm text-neutral-400">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="text-center text-sm text-neutral-400 py-8">No messages yet</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'agent' || msg.sender === 'bot' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm ${
                        msg.sender === 'agent' || msg.sender === 'bot'
                          ? 'bg-primary-500 text-white rounded-br-sm'
                          : 'bg-neutral-100 text-neutral-900 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  className="flex-1 px-4 py-2.5 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Button onClick={handleSend} icon={<Send className="w-4 h-4" />} disabled={!messageInput.trim()}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white rounded-xl border border-neutral-200">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500">Select a conversation to start chatting</p>
            </div>
          </div>
        )}

        {/* Right panel - Customer info */}
        {currentConversation && (
          <div className="w-64 flex-shrink-0">
            <Card variant="elevated" padding="md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary-700 font-semibold">
                  {currentConversation.customerName?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-medium text-neutral-900">{currentConversation.customerName || 'Unknown'}</p>
                  <p className="text-xs text-neutral-500">{currentConversation.customerPhone || 'No phone'}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Channel</p>
                  <p className="text-sm capitalize text-neutral-700">{currentConversation.channel}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Status</p>
                  <Badge variant={getStatusVariant(currentConversation.status)}>
                    {CONVERSATION_STATUSES[currentConversation.status].label}
                  </Badge>
                </div>
                {currentConversation.tags.length > 0 && (
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {currentConversation.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
                {currentConversation.satisfactionRating && (
                  <div>
                    <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Satisfaction</p>
                    <p className="text-sm text-neutral-700">{'⭐'.repeat(currentConversation.satisfactionRating)}</p>
                  </div>
                )}
              </div>
              <Button variant="secondary" size="sm" className="w-full mt-4" icon={<User className="w-4 h-4" />}>
                Full Profile
              </Button>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
