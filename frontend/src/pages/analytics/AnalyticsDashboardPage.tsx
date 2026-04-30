import { useState } from 'react'
import { Download, TrendingDown, TrendingUp } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { ConversationChart } from '@/components/charts/ConversationChart'
import { EngagementChart } from '@/components/charts/EngagementChart'
import { RevenueChart } from '@/components/charts/RevenueChart'
import { useAnalytics } from '@/hooks/useAnalytics'
import { formatNumber, formatPercent } from '@/utils/formatters'
import { SkeletonCard, SkeletonLine } from '@/components/common/Spinner'

const MOCK_CONV_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  conversations: Math.floor(Math.random() * 150) + 30,
  botHandled: Math.floor(Math.random() * 100) + 20,
}))

const MOCK_ENGAGEMENT_DATA = [
  { channel: 'WhatsApp', posts: 45 },
  { channel: 'Instagram', posts: 32 },
  { channel: 'TikTok', posts: 18 },
  { channel: 'Facebook', posts: 28 },
]

const MOCK_REVENUE_DATA = Array.from({ length: 12 }, (_, i) => ({
  date: new Date(2026, i, 1).toLocaleDateString('en', { month: 'short' }),
  revenue: Math.floor(Math.random() * 20000) + 5000,
  target: 15000,
}))

const DATE_RANGES = ['7d', '30d', '90d', '1y'] as const

export function AnalyticsDashboardPage() {
  const { dashboard, isLoading } = useAnalytics()
  const [dateRange, setDateRange] = useState<(typeof DATE_RANGES)[number]>('30d')

  const metrics = [
    {
      label: 'Total Conversations',
      value: formatNumber(dashboard?.totalConversations ?? 12847),
      change: +12.5,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Bot Success Rate',
      value: formatPercent(dashboard?.botSuccessRate ?? 78.2),
      change: +3.1,
      color: 'text-primary-700',
      bg: 'bg-primary-light',
    },
    {
      label: 'Avg Satisfaction',
      value: `${(dashboard?.satisfactionScore ?? 4.3).toFixed(1)}/5`,
      change: +0.2,
      color: 'text-yellow-700',
      bg: 'bg-yellow-50',
    },
    {
      label: 'Total Posts',
      value: formatNumber(dashboard?.totalPosts ?? 356),
      change: -2.8,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ]

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics Dashboard</h1>
          <p className="text-sm text-neutral-500 mt-1">Track your performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            {DATE_RANGES.map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  dateRange === range ? 'bg-primary-500 text-white' : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array(4).fill(null).map((_, i) => <SkeletonCard key={i} />)
          : metrics.map(({ label, value, change, color, bg }) => (
              <Card key={label} variant="elevated" padding="md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-neutral-900">{value}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-lg ${bg}`}>
                    <div className={`flex items-center gap-1 text-xs font-medium ${color}`}>
                      {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {Math.abs(change)}%
                    </div>
                  </div>
                </div>
              </Card>
            ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Conversations Over Time</CardTitle>
          </div>
          {isLoading ? <SkeletonLine className="h-64" /> : <ConversationChart data={MOCK_CONV_DATA} />}
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Revenue</CardTitle>
          </div>
          {isLoading ? <SkeletonLine className="h-64" /> : <RevenueChart data={MOCK_REVENUE_DATA} />}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Channel Breakdown</CardTitle>
          </div>
          {isLoading ? <SkeletonLine className="h-64" /> : <EngagementChart data={MOCK_ENGAGEMENT_DATA} type="pie" />}
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Posts by Channel</CardTitle>
          </div>
          {isLoading ? <SkeletonLine className="h-64" /> : <EngagementChart data={MOCK_ENGAGEMENT_DATA} type="bar" />}
        </Card>
      </div>
    </DashboardLayout>
  )
}
