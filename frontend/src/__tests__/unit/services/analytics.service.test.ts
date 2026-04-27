import { describe, it, expect, vi, beforeEach } from 'vitest'
import { analyticsService } from '@/services/analytics.service'
import apiClient from '@/lib/api-client'

vi.mock('@/lib/api-client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

const mockGet = apiClient.get as ReturnType<typeof vi.fn>
const mockPost = apiClient.post as ReturnType<typeof vi.fn>

const sampleDashboard = {
  totalConversations: 100,
  activeAgents: 3,
  avgResponseTime: 2500,
  satisfactionRate: 0.92,
}

describe('analyticsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getDashboard', () => {
    it('should fetch dashboard data without query params', async () => {
      mockGet.mockResolvedValue({ data: sampleDashboard })

      const result = await analyticsService.getDashboard()

      expect(mockGet).toHaveBeenCalledWith('/analytics/dashboard', { params: undefined })
      expect(result).toEqual(sampleDashboard)
    })

    it('should fetch dashboard data with query params', async () => {
      mockGet.mockResolvedValue({ data: sampleDashboard })

      await analyticsService.getDashboard({ businessId: 'biz-1', dateFrom: '2024-01-01' })

      expect(mockGet).toHaveBeenCalledWith('/analytics/dashboard', {
        params: { businessId: 'biz-1', dateFrom: '2024-01-01' },
      })
    })
  })

  describe('getConversationStats', () => {
    it('should fetch conversation stats', async () => {
      const stats = { total: 100, resolved: 80 }
      mockGet.mockResolvedValue({ data: stats })

      const result = await analyticsService.getConversationStats()

      expect(mockGet).toHaveBeenCalledWith('/analytics/conversations', { params: undefined })
      expect(result).toEqual(stats)
    })
  })

  describe('getContentPerformance', () => {
    it('should fetch content performance data', async () => {
      const performance = { posts: 10, reach: 5000 }
      mockGet.mockResolvedValue({ data: performance })

      const result = await analyticsService.getContentPerformance()

      expect(mockGet).toHaveBeenCalledWith('/analytics/content', { params: undefined })
      expect(result).toEqual(performance)
    })
  })

  describe('getChannelBreakdown', () => {
    it('should fetch channel breakdown data', async () => {
      const breakdown = [{ channel: 'whatsapp', count: 50 }, { channel: 'instagram', count: 30 }]
      mockGet.mockResolvedValue({ data: breakdown })

      const result = await analyticsService.getChannelBreakdown()

      expect(mockGet).toHaveBeenCalledWith('/analytics/channels', { params: undefined })
      expect(result).toEqual(breakdown)
    })
  })

  describe('generateReport', () => {
    it('should generate an analytics report', async () => {
      const report = { url: 'https://example.com/report.pdf' }
      mockPost.mockResolvedValue({ data: report })

      const result = await analyticsService.generateReport({ businessId: 'biz-1' })

      expect(mockPost).toHaveBeenCalledWith('/analytics/report', { businessId: 'biz-1' })
      expect(result).toEqual(report)
    })
  })
})
