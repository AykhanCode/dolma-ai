import { create } from 'zustand'
import type { Conversation, Message, ConversationFilters } from '@/types'
import { conversationsService } from '@/services/conversations.service'

interface ConversationState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  filters: ConversationFilters
  isLoading: boolean
  isLoadingMessages: boolean
  error: string | null
  fetchConversations: () => Promise<void>
  setCurrentConversation: (conversation: Conversation | null) => void
  fetchMessages: (conversationId: string) => Promise<void>
  sendMessage: (conversationId: string, content: string) => Promise<void>
  escalateConversation: (id: string) => Promise<void>
  closeConversation: (id: string) => Promise<void>
  setFilters: (filters: ConversationFilters) => void
  addMessage: (message: Message) => void
}

export const useConversationStore = create<ConversationState>()((set, get) => ({
  conversations: [],
  currentConversation: null,
  messages: [],
  filters: {},
  isLoading: false,
  isLoadingMessages: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null })
    try {
      const result = await conversationsService.list(get().filters)
      set({ conversations: result.data || [], isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load conversations'
      set({ error: message, isLoading: false })
    }
  },

  setCurrentConversation: (conversation) => set({ currentConversation: conversation, messages: [] }),

  fetchMessages: async (conversationId) => {
    set({ isLoadingMessages: true })
    try {
      const result = await conversationsService.getMessages(conversationId)
      set({ messages: result.data || [], isLoadingMessages: false })
    } catch {
      set({ isLoadingMessages: false })
    }
  },

  sendMessage: async (conversationId, content) => {
    const message = await conversationsService.sendMessage(conversationId, content)
    set((state) => ({ messages: [...state.messages, message] }))
  },

  escalateConversation: async (id) => {
    const updated = await conversationsService.escalate(id)
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? updated : c)),
      currentConversation: state.currentConversation?.id === id ? updated : state.currentConversation,
    }))
  },

  closeConversation: async (id) => {
    const updated = await conversationsService.close(id)
    set((state) => ({
      conversations: state.conversations.map((c) => (c.id === id ? updated : c)),
      currentConversation: state.currentConversation?.id === id ? updated : state.currentConversation,
    }))
  },

  setFilters: (filters) => set({ filters }),

  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
}))
