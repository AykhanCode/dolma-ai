import { describe, it, expect, vi, beforeEach } from 'vitest'
import { contentService } from '@/services/content.service'
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

const samplePost = {
  id: '1',
  caption: 'A great caption',
  status: 'draft',
  channels: ['instagram'],
}

describe('contentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('list', () => {
    it('should list posts without businessId', async () => {
      mockGet.mockResolvedValue({ data: { data: [samplePost], total: 1 } })

      const result = await contentService.list()

      expect(mockGet).toHaveBeenCalledWith('/content', { params: {} })
      expect(result.data).toHaveLength(1)
    })

    it('should list posts filtered by businessId', async () => {
      mockGet.mockResolvedValue({ data: { data: [samplePost], total: 1 } })

      await contentService.list('biz-1')

      expect(mockGet).toHaveBeenCalledWith('/content', { params: { businessId: 'biz-1' } })
    })
  })

  describe('get', () => {
    it('should fetch a single post by id', async () => {
      mockGet.mockResolvedValue({ data: samplePost })

      const result = await contentService.get('1')

      expect(mockGet).toHaveBeenCalledWith('/content/1')
      expect(result).toEqual(samplePost)
    })
  })

  describe('create', () => {
    it('should create a new post', async () => {
      mockPost.mockResolvedValue({ data: samplePost })

      const result = await contentService.create({ caption: 'A great caption', channels: ['instagram'] } as never)

      expect(mockPost).toHaveBeenCalledWith('/content', expect.objectContaining({ caption: 'A great caption' }))
      expect(result).toEqual(samplePost)
    })
  })

  describe('update', () => {
    it('should update a post', async () => {
      const updated = { ...samplePost, caption: 'Updated caption' }
      mockPatch.mockResolvedValue({ data: updated })

      const result = await contentService.update('1', { caption: 'Updated caption' } as never)

      expect(mockPatch).toHaveBeenCalledWith('/content/1', { caption: 'Updated caption' })
      expect(result.caption).toBe('Updated caption')
    })
  })

  describe('delete', () => {
    it('should delete a post', async () => {
      mockDelete.mockResolvedValue({ data: undefined })

      await contentService.delete('1')

      expect(mockDelete).toHaveBeenCalledWith('/content/1')
    })
  })

  describe('publish', () => {
    it('should publish a post', async () => {
      const published = { ...samplePost, status: 'published' }
      mockPost.mockResolvedValue({ data: published })

      const result = await contentService.publish('1')

      expect(mockPost).toHaveBeenCalledWith('/content/1/publish')
      expect(result.status).toBe('published')
    })
  })

  describe('schedule', () => {
    it('should schedule a post', async () => {
      const scheduled = { ...samplePost, status: 'scheduled', scheduledAt: '2024-01-15T10:00:00Z' }
      mockPost.mockResolvedValue({ data: scheduled })

      const result = await contentService.schedule('1', '2024-01-15T10:00:00Z')

      expect(mockPost).toHaveBeenCalledWith('/content/1/schedule', { scheduledAt: '2024-01-15T10:00:00Z' })
      expect(result.status).toBe('scheduled')
    })
  })

  describe('generateCaptions', () => {
    it('should generate captions from an image URL', async () => {
      const captions = ['Caption 1', 'Caption 2', 'Caption 3']
      mockPost.mockResolvedValue({ data: captions })

      const result = await contentService.generateCaptions('https://example.com/image.jpg')

      expect(mockPost).toHaveBeenCalledWith('/content/generate-captions', {
        imageUrl: 'https://example.com/image.jpg',
        context: undefined,
      })
      expect(result).toEqual(captions)
    })
  })
})
