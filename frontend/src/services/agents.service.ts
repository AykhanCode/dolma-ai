import apiClient from '@/lib/api-client'
import type { Agent, CreateAgentDto, PaginatedResponse } from '@/types'

export const agentsService = {
  async list(businessId?: string): Promise<PaginatedResponse<Agent>> {
    const params = businessId ? { businessId } : {}
    const { data } = await apiClient.get('/agents', { params })
    return data
  },

  async get(id: string): Promise<Agent> {
    const { data } = await apiClient.get(`/agents/${id}`)
    return data
  },

  async create(dto: CreateAgentDto): Promise<Agent> {
    const { data } = await apiClient.post('/agents', dto)
    return data
  },

  async update(id: string, dto: Partial<CreateAgentDto>): Promise<Agent> {
    const { data } = await apiClient.patch(`/agents/${id}`, dto)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/agents/${id}`)
  },

  async deploy(id: string): Promise<Agent> {
    const { data } = await apiClient.post(`/agents/${id}/deploy`)
    return data
  },

  async pause(id: string): Promise<Agent> {
    const { data } = await apiClient.post(`/agents/${id}/pause`)
    return data
  },
}
