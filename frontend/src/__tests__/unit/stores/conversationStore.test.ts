import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useConversationStore } from '@/store/conversationStore'
import { conversationsService } from '@/services/conversations.service'
import type { Conversation, Message } from '@/types'

vi.mock('@/services/conversations.service', () => ({
  conversationsService: {
    list: vi.fn(),
    get: vi.fn(),
    getMessages: vi.fn(),
    sendMessage: vi.fn(),
    escalate: vi.fn(),
    close: vi.fn(),
    addTag: vi.fn(),
    rate: vi.fn(),
  },
}))

const mockList = conversationsService.list as ReturnType<typeof vi.fn>
const mockGetMessages = conversationsService.getMessages as ReturnType<typeof vi.fn>
const mockSendMessage = conversationsService.sendMessage as ReturnType<typeof vi.fn>
const mockEscalate = conversationsService.escalate as ReturnType<typeof vi.fn>
const mockClose = conversationsService.close as ReturnType<typeof vi.fn>

const sampleConversation: Conversation = {
  id: '1',
  status: 'open',
  channel: 'whatsapp',
} as Conversation

const sampleMessage: Message = {
  id: 'msg-1',
  conversationId: '1',
  content: 'Hello!',
  type: 'text',
  sender: 'customer',
  createdAt: new Date().toISOString(),
}

describe('conversationStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useConversationStore.setState({
      conversations: [],
      currentConversation: null,
      messages: [],
      filters: {},
      isLoading: false,
      isLoadingMessages: false,
      error: null,
    })
  })

  describe('fetchConversations', () => {
    it('should load conversations successfully', async () => {
      mockList.mockResolvedValue({ data: [sampleConversation], total: 1 })

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.fetchConversations()
      })

      expect(result.current.conversations).toHaveLength(1)
      expect(result.current.conversations[0]).toEqual(sampleConversation)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle fetch error', async () => {
      mockList.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.fetchConversations()
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.conversations).toHaveLength(0)
    })
  })

  describe('setCurrentConversation', () => {
    it('should set the current conversation and clear messages', () => {
      useConversationStore.setState({ messages: [sampleMessage] })
      const { result } = renderHook(() => useConversationStore())

      act(() => {
        result.current.setCurrentConversation(sampleConversation)
      })

      expect(result.current.currentConversation).toEqual(sampleConversation)
      expect(result.current.messages).toHaveLength(0)
    })

    it('should clear current conversation when called with null', () => {
      useConversationStore.setState({ currentConversation: sampleConversation })
      const { result } = renderHook(() => useConversationStore())

      act(() => {
        result.current.setCurrentConversation(null)
      })

      expect(result.current.currentConversation).toBeNull()
    })
  })

  describe('fetchMessages', () => {
    it('should load messages for a conversation', async () => {
      mockGetMessages.mockResolvedValue({ data: [sampleMessage], total: 1 })

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.fetchMessages('1')
      })

      expect(result.current.messages).toHaveLength(1)
      expect(result.current.messages[0]).toEqual(sampleMessage)
      expect(result.current.isLoadingMessages).toBe(false)
    })

    it('should handle message fetch error gracefully', async () => {
      mockGetMessages.mockRejectedValue(new Error('Failed'))

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.fetchMessages('1')
      })

      expect(result.current.isLoadingMessages).toBe(false)
      expect(result.current.messages).toHaveLength(0)
    })
  })

  describe('sendMessage', () => {
    it('should send a message and append it to the messages list', async () => {
      const newMessage = { ...sampleMessage, id: 'msg-2', content: 'Reply' }
      mockSendMessage.mockResolvedValue(newMessage)

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.sendMessage('1', 'Reply')
      })

      expect(result.current.messages).toContainEqual(newMessage)
    })
  })

  describe('escalateConversation', () => {
    it('should escalate a conversation and update the list', async () => {
      useConversationStore.setState({ conversations: [sampleConversation] })
      const escalated = { ...sampleConversation, status: 'escalated' as never }
      mockEscalate.mockResolvedValue(escalated)

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.escalateConversation('1')
      })

      expect(result.current.conversations[0].status).toBe('escalated')
    })
  })

  describe('closeConversation', () => {
    it('should close a conversation and update the list', async () => {
      useConversationStore.setState({ conversations: [sampleConversation] })
      const closed = { ...sampleConversation, status: 'closed' as never }
      mockClose.mockResolvedValue(closed)

      const { result } = renderHook(() => useConversationStore())

      await act(async () => {
        await result.current.closeConversation('1')
      })

      expect(result.current.conversations[0].status).toBe('closed')
    })
  })

  describe('addMessage', () => {
    it('should append a message to the messages list', () => {
      const { result } = renderHook(() => useConversationStore())

      act(() => {
        result.current.addMessage(sampleMessage)
      })

      expect(result.current.messages).toContainEqual(sampleMessage)
    })
  })

  describe('setFilters', () => {
    it('should update the filters', () => {
      const { result } = renderHook(() => useConversationStore())

      act(() => {
        result.current.setFilters({ channel: 'whatsapp' } as never)
      })

      expect(result.current.filters).toEqual({ channel: 'whatsapp' })
    })
  })
})
