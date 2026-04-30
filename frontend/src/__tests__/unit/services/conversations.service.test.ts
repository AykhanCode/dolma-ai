import { describe, it, expect, vi, beforeEach } from 'vitest'
import { conversationsService } from '@/services/conversations.service'
import apiClient from '@/lib/api-client'

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockGet = apiClient.get as ReturnType<typeof vi.fn>
const mockPost = apiClient.post as ReturnType<typeof vi.fn>

const sampleConversation = {
  id: '1',
  status: 'open',
  channel: 'whatsapp',
}

const sampleMessage = {
  id: 'msg-1',
  conversationId: '1',
  content: 'Hello!',
  role: 'user',
}

describe('conversationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should fetch conversations without filters', async () => {
      mockGet.mockResolvedValue({ data: { data: [sampleConversation], total: 1 } })

      const result = await conversationsService.list()

      expect(mockGet).toHaveBeenCalledWith('/conversations', { params: undefined })
      expect(result.data).toHaveLength(1)
    })

    it('should fetch conversations with filters', async () => {
      mockGet.mockResolvedValue({ data: { data: [], total: 0 } })

      await conversationsService.list({ channel: 'whatsapp' } as never)

      expect(mockGet).toHaveBeenCalledWith('/conversations', {
        params: { channel: 'whatsapp' },
      })
    })
  })

  describe('get', () => {
    it('should fetch a single conversation by id', async () => {
      mockGet.mockResolvedValue({ data: sampleConversation })

      const result = await conversationsService.get('1')

      expect(mockGet).toHaveBeenCalledWith('/conversations/1')
      expect(result).toEqual(sampleConversation)
    })
  })

  describe('getMessages', () => {
    it('should fetch messages for a conversation', async () => {
      mockGet.mockResolvedValue({ data: { data: [sampleMessage], total: 1 } })

      const result = await conversationsService.getMessages('1')

      expect(mockGet).toHaveBeenCalledWith('/conversations/1/messages')
      expect(result.data).toHaveLength(1)
    })
  })

  describe('sendMessage', () => {
    it('should send a message to a conversation', async () => {
      mockPost.mockResolvedValue({ data: sampleMessage })

      const result = await conversationsService.sendMessage('1', 'Hello!')

      expect(mockPost).toHaveBeenCalledWith('/conversations/1/messages', { content: 'Hello!' })
      expect(result).toEqual(sampleMessage)
    })
  })

  describe('escalate', () => {
    it('should escalate a conversation', async () => {
      const escalated = { ...sampleConversation, status: 'escalated' }
      mockPost.mockResolvedValue({ data: escalated })

      const result = await conversationsService.escalate('1')

      expect(mockPost).toHaveBeenCalledWith('/conversations/1/escalate')
      expect(result.status).toBe('escalated')
    })
  })

  describe('close', () => {
    it('should close a conversation', async () => {
      const closed = { ...sampleConversation, status: 'closed' }
      mockPost.mockResolvedValue({ data: closed })

      const result = await conversationsService.close('1')

      expect(mockPost).toHaveBeenCalledWith('/conversations/1/close')
      expect(result.status).toBe('closed')
    })
  })

  describe('addTag', () => {
    it('should add a tag to a conversation', async () => {
      const tagged = { ...sampleConversation, tags: ['urgent'] }
      mockPost.mockResolvedValue({ data: tagged })

      await conversationsService.addTag('1', 'urgent')

      expect(mockPost).toHaveBeenCalledWith('/conversations/1/tags', { tag: 'urgent' })
    })
  })

  describe('rate', () => {
    it('should rate a conversation', async () => {
      const rated = { ...sampleConversation, rating: 5 }
      mockPost.mockResolvedValue({ data: rated })

      await conversationsService.rate('1', 5)

      expect(mockPost).toHaveBeenCalledWith('/conversations/1/rate', { rating: 5 })
    })
  })
})
