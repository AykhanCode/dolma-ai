import { describe, it, expect, vi, beforeEach } from 'vitest'
import { agentsService } from '@/services/agents.service'
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
const mockPatch = apiClient.patch as ReturnType<typeof vi.fn>
const mockDelete = apiClient.delete as ReturnType<typeof vi.fn>

const sampleAgent = {
  id: '1',
  name: 'Support Bot',
  status: 'active',
  channels: ['whatsapp'],
}

describe('agentsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should fetch agents without businessId', async () => {
      mockGet.mockResolvedValue({ data: { data: [sampleAgent], total: 1 } })

      const result = await agentsService.list()

      expect(mockGet).toHaveBeenCalledWith('/agents', { params: {} })
      expect(result.data).toHaveLength(1)
    })

    it('should fetch agents filtered by businessId', async () => {
      mockGet.mockResolvedValue({ data: { data: [sampleAgent], total: 1 } })

      await agentsService.list('biz-1')

      expect(mockGet).toHaveBeenCalledWith('/agents', { params: { businessId: 'biz-1' } })
    })
  })

  describe('get', () => {
    it('should fetch a single agent by id', async () => {
      mockGet.mockResolvedValue({ data: sampleAgent })

      const result = await agentsService.get('1')

      expect(mockGet).toHaveBeenCalledWith('/agents/1')
      expect(result).toEqual(sampleAgent)
    })
  })

  describe('create', () => {
    it('should create a new agent', async () => {
      mockPost.mockResolvedValue({ data: sampleAgent })

      const result = await agentsService.create({ name: 'Support Bot', channels: ['whatsapp'] } as never)

      expect(mockPost).toHaveBeenCalledWith('/agents', expect.objectContaining({ name: 'Support Bot' }))
      expect(result).toEqual(sampleAgent)
    })
  })

  describe('update', () => {
    it('should update an agent', async () => {
      const updatedAgent = { ...sampleAgent, name: 'Updated Bot' }
      mockPatch.mockResolvedValue({ data: updatedAgent })

      const result = await agentsService.update('1', { name: 'Updated Bot' } as never)

      expect(mockPatch).toHaveBeenCalledWith('/agents/1', { name: 'Updated Bot' })
      expect(result.name).toBe('Updated Bot')
    })
  })

  describe('delete', () => {
    it('should delete an agent', async () => {
      mockDelete.mockResolvedValue({ data: undefined })

      await agentsService.delete('1')

      expect(mockDelete).toHaveBeenCalledWith('/agents/1')
    })
  })

  describe('deploy', () => {
    it('should deploy an agent', async () => {
      const deployedAgent = { ...sampleAgent, status: 'active' }
      mockPost.mockResolvedValue({ data: deployedAgent })

      const result = await agentsService.deploy('1')

      expect(mockPost).toHaveBeenCalledWith('/agents/1/deploy')
      expect(result.status).toBe('active')
    })
  })

  describe('pause', () => {
    it('should pause an agent', async () => {
      const pausedAgent = { ...sampleAgent, status: 'paused' }
      mockPost.mockResolvedValue({ data: pausedAgent })

      const result = await agentsService.pause('1')

      expect(mockPost).toHaveBeenCalledWith('/agents/1/pause')
      expect(result.status).toBe('paused')
    })
  })
})
