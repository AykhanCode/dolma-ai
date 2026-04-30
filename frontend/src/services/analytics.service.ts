import apiClient from '@/lib/api-client'
import type { AnalyticsDashboard } from '@/types'

export interface AnalyticsQuery {
  businessId?: string
  dateFrom?: string
  dateTo?: string
  channel?: string
}

export const analyticsService = {
  async getDashboard(query?: AnalyticsQuery): Promise<AnalyticsDashboard> {
    const { data } = await apiClient.get('/analytics/dashboard', { params: query })
    return data
  },

  async getConversationStats(query?: AnalyticsQuery): Promise<unknown> {
    const { data } = await apiClient.get('/analytics/conversations', { params: query })
    return data
  },

  async getContentPerformance(query?: AnalyticsQuery): Promise<unknown> {
    const { data } = await apiClient.get('/analytics/content', { params: query })
    return data
  },

  async getChannelBreakdown(query?: AnalyticsQuery): Promise<unknown> {
    const { data } = await apiClient.get('/analytics/channels', { params: query })
    return data
  },

  async generateReport(query?: AnalyticsQuery): Promise<unknown> {
    const { data } = await apiClient.post('/analytics/report', query)
    return data
  },
}
