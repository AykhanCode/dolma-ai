import apiClient from '@/lib/api-client'
import type { Business, PaginatedResponse } from '@/types'

export const businessesService = {
  async list(): Promise<Business[]> {
    const { data } = await apiClient.get('/businesses')
    return data
  },

  async get(id: string): Promise<Business> {
    const { data } = await apiClient.get(`/businesses/${id}`)
    return data
  },

  async create(dto: Partial<Business>): Promise<Business> {
    const { data } = await apiClient.post('/businesses', dto)
    return data
  },

  async update(id: string, dto: Partial<Business>): Promise<Business> {
    const { data } = await apiClient.patch(`/businesses/${id}`, dto)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/businesses/${id}`)
  },

  async uploadDocument(businessId: string, formData: FormData): Promise<unknown> {
    const { data } = await apiClient.post(`/businesses/${businessId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  },

  async listDocuments(businessId: string): Promise<PaginatedResponse<unknown>> {
    const { data } = await apiClient.get(`/businesses/${businessId}/documents`)
    return data
  },
}
