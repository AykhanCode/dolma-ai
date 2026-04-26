import apiClient from '@/lib/api-client'
import type { Conversation, Message, ConversationFilters, PaginatedResponse } from '@/types'

export const conversationsService = {
  async list(filters?: ConversationFilters): Promise<PaginatedResponse<Conversation>> {
    const { data } = await apiClient.get('/conversations', { params: filters })
    return data
  },

  async get(id: string): Promise<Conversation> {
    const { data } = await apiClient.get(`/conversations/${id}`)
    return data
  },

  async getMessages(conversationId: string): Promise<PaginatedResponse<Message>> {
    const { data } = await apiClient.get(`/conversations/${conversationId}/messages`)
    return data
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    const { data } = await apiClient.post(`/conversations/${conversationId}/messages`, { content })
    return data
  },

  async escalate(id: string): Promise<Conversation> {
    const { data } = await apiClient.post(`/conversations/${id}/escalate`)
    return data
  },

  async close(id: string): Promise<Conversation> {
    const { data } = await apiClient.post(`/conversations/${id}/close`)
    return data
  },

  async addTag(id: string, tag: string): Promise<Conversation> {
    const { data } = await apiClient.post(`/conversations/${id}/tags`, { tag })
    return data
  },

  async rate(id: string, rating: number): Promise<Conversation> {
    const { data } = await apiClient.post(`/conversations/${id}/rate`, { rating })
    return data
  },
}
