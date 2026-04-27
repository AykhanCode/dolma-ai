import { Link } from 'react-router-dom'
import { BarChart2, Bot, MessageSquare, Plus, TrendingUp, Users } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { ConversationChart } from '@/components/charts/ConversationChart'
import { useAuthStore } from '@/store/authStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { formatNumber, formatRelativeTime } from '@/utils/formatters'
import { SkeletonCard } from '@/components/common/Spinner'

const MOCK_CHART_DATA = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
  conversations: Math.floor(Math.random() * 100) + 20,
  botHandled: Math.floor(Math.random() * 70) + 10,
}))

const MOCK_RECENT_CONVS = [
  { id: '1', customer: 'Alice Johnson', channel: 'whatsapp', status: 'open', time: new Date(Date.now() - 300000).toISOString() },
  { id: '2', customer: 'Bob Smith', channel: 'instagram', status: 'escalated', time: new Date(Date.now() - 900000).toISOString() },
  { id: '3', customer: 'Carol Davis', channel: 'facebook', status: 'closed', time: new Date(Date.now() - 3600000).toISOString() },
]

export function DashboardPage() {
  const { user } = useAuthStore()
  const { dashboard, isLoading } = useAnalytics()

  const stats = [
    {
      label: 'Total Conversations',
      value: formatNumber(dashboard?.totalConversations ?? 1247),
      icon: MessageSquare,
      color: 'bg-blue-50 text-blue-600',
      change: '+12%',
    },
    {
      label: 'Bot Success Rate',
      value: `${(dashboard?.botSuccessRate ?? 78.5).toFixed(1)}%`,
      icon: Bot,
      color: 'bg-primary-light text-primary-700',
      change: '+3.2%',
    },
    {
      label: 'Engagement Rate',
      value: `${(dashboard?.totalEngagement ?? 4.8).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      change: '+0.8%',
    },
    {
      label: 'Active Users',
      value: formatNumber(3142),
      icon: Users,
      color: 'bg-orange-50 text-orange-600',
      change: '+5.1%',
    },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Welcome back, {user?.firstName ?? 'there'} 👋
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Here's what's happening with your AI agents today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/agents/create">
            <Button icon={<Plus className="w-4 h-4" />}>New Agent</Button>
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isLoading
          ? Array(4).fill(null).map((_, i) => <SkeletonCard key={i} />)
          : stats.map(({ label, value, icon: Icon, color, change }) => (
              <Card key={label} variant="elevated" padding="md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">{label}</p>
                    <p className="text-2xl font-bold text-neutral-900">{value}</p>
                    <p className="text-xs text-green-600 font-medium mt-1">{change} this week</p>
                  </div>
                  <div className={`p-2.5 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversations chart */}
        <Card variant="elevated" padding="md" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Conversations Overview</CardTitle>
            <span className="text-xs text-neutral-500">Last 7 days</span>
          </div>
          <ConversationChart data={MOCK_CHART_DATA} />
        </Card>

        {/* Recent conversations */}
        <Card variant="elevated" padding="md">
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Recent Conversations</CardTitle>
            <Link to="/chat" className="text-xs text-primary-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {MOCK_RECENT_CONVS.map((conv) => (
              <div key={conv.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors">
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary-700 text-xs font-semibold flex-shrink-0">
                  {conv.customer[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{conv.customer}</p>
                  <p className="text-xs text-neutral-400">{formatRelativeTime(conv.time)}</p>
                </div>
                <Badge
                  variant={conv.status === 'open' ? 'info' : conv.status === 'escalated' ? 'danger' : 'neutral'}
                  size="sm"
                >
                  {conv.status}
                </Badge>
              </div>
            ))}
          </div>
          <Link to="/chat">
            <Button variant="ghost" className="w-full mt-3" size="sm">
              View all conversations
            </Button>
          </Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { to: '/agents/create', icon: Bot, label: 'Create Agent', color: 'text-primary-600' },
          { to: '/content/create', icon: Plus, label: 'New Post', color: 'text-purple-600' },
          { to: '/chat', icon: MessageSquare, label: 'View Chats', color: 'text-blue-600' },
          { to: '/analytics', icon: BarChart2, label: 'Analytics', color: 'text-orange-600' },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to}>
            <Card variant="bordered" padding="sm" hover className="text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-sm font-medium text-neutral-700">{label}</p>
            </Card>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
