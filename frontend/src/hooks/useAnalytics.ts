import { useEffect, useState } from 'react'
import { analyticsService, type AnalyticsQuery } from '@/services/analytics.service'
import { useBusinessStore } from '@/store/businessStore'
import type { AnalyticsDashboard } from '@/types'

export function useAnalytics(query?: Omit<AnalyticsQuery, 'businessId'>) {
  const { currentBusiness } = useBusinessStore()
  const [dashboard, setDashboard] = useState<AnalyticsDashboard | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await analyticsService.getDashboard({
        ...query,
        businessId: currentBusiness?.id,
      })
      setDashboard(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (currentBusiness) {
      fetchAnalytics()
    }
  }, [currentBusiness?.id])

  return { dashboard, isLoading, error, refetch: fetchAnalytics }
}
