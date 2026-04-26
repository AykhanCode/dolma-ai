import apiClient from '@/lib/api-client'
import type { Post, CreatePostDto, PaginatedResponse } from '@/types'

export const contentService = {
  async list(businessId?: string): Promise<PaginatedResponse<Post>> {
    const params = businessId ? { businessId } : {}
    const { data } = await apiClient.get('/content', { params })
    return data
  },

  async get(id: string): Promise<Post> {
    const { data } = await apiClient.get(`/content/${id}`)
    return data
  },

  async create(dto: CreatePostDto): Promise<Post> {
    const { data } = await apiClient.post('/content', dto)
    return data
  },

  async update(id: string, dto: Partial<CreatePostDto>): Promise<Post> {
    const { data } = await apiClient.patch(`/content/${id}`, dto)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/content/${id}`)
  },

  async publish(id: string): Promise<Post> {
    const { data } = await apiClient.post(`/content/${id}/publish`)
    return data
  },

  async schedule(id: string, scheduledAt: string): Promise<Post> {
    const { data } = await apiClient.post(`/content/${id}/schedule`, { scheduledAt })
    return data
  },

  async uploadImage(formData: FormData): Promise<{ url: string }> {
    const { data } = await apiClient.post('/content/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async generateCaptions(imageUrl: string, context?: string): Promise<string[]> {
    const { data } = await apiClient.post('/content/generate-captions', { imageUrl, context })
    return data
  },
}
