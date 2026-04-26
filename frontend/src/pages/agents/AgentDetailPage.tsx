import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Bot, Edit, Pause, Play, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { useAgentStore } from '@/store/agentStore'
import { AGENT_STATUSES, CHANNELS } from '@/utils/constants'
import { formatDateTime } from '@/utils/formatters'
import { FullPageSpinner } from '@/components/common/Spinner'
import type { AgentStatus } from '@/types'
import toast from 'react-hot-toast'

export function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { agents, isLoading, setCurrentAgent, deployAgent, pauseAgent, deleteAgent } = useAgentStore()

  const agent = agents.find((a) => a.id === id)

  useEffect(() => {
    if (agent) setCurrentAgent(agent)
    return () => setCurrentAgent(null)
  }, [agent])

  if (isLoading) return <FullPageSpinner />
  if (!agent) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <Bot className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-700">Agent not found</h2>
          <Link to="/agents" className="mt-4 inline-block text-primary-600 hover:underline">
            Back to agents
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const getStatusVariant = (status: AgentStatus) => {
    const map: Record<AgentStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
      active: 'success', draft: 'neutral', paused: 'warning', archived: 'danger',
    }
    return map[status]
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    try {
      await deleteAgent(agent.id)
      toast.success('Agent deleted')
      navigate('/agents')
    } catch {
      toast.error('Failed to delete agent')
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button variant="ghost" size="sm" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/agents')}>
          Back to Agents
        </Button>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <Card variant="elevated" padding="md">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary-light rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-primary-600" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-neutral-900">{agent.name}</h1>
                  <Badge variant={getStatusVariant(agent.status)} dot>
                    {AGENT_STATUSES[agent.status].label}
                  </Badge>
                </div>
                {agent.description && (
                  <p className="text-sm text-neutral-500 mt-1">{agent.description}</p>
                )}
                <p className="text-xs text-neutral-400 mt-1">Created {formatDateTime(agent.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {agent.status === 'active' ? (
                <Button variant="secondary" size="sm" icon={<Pause className="w-4 h-4" />}
                  onClick={async () => { await pauseAgent(agent.id); toast.success('Agent paused') }}>
                  Pause
                </Button>
              ) : (
                <Button size="sm" icon={<Play className="w-4 h-4" />}
                  onClick={async () => { await deployAgent(agent.id); toast.success('Agent deployed!') }}>
                  Deploy
                </Button>
              )}
              <Button variant="ghost" size="sm" icon={<Edit className="w-4 h-4" />}>Edit</Button>
              <button onClick={handleDelete} className="p-2 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Channels */}
          <Card variant="elevated" padding="md">
            <CardTitle className="mb-4">Active Channels</CardTitle>
            <div className="space-y-2">
              {CHANNELS.filter((c) => agent.channels.includes(c.value as never)).map((ch) => (
                <div key={ch.value} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="text-sm font-medium text-neutral-700">{ch.label}</span>
                  <Badge variant="success" size="sm" className="ml-auto">Active</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Personality */}
          {agent.personality && (
            <Card variant="elevated" padding="md">
              <CardTitle className="mb-4">Personality Settings</CardTitle>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-neutral-500 uppercase tracking-wide">Tone</p>
                  <p className="text-sm font-medium text-neutral-800 mt-0.5 capitalize">{agent.personality.tone}</p>
                </div>
                {agent.personality.greeting && (
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Greeting</p>
                    <p className="text-sm text-neutral-800 mt-0.5">{agent.personality.greeting}</p>
                  </div>
                )}
                {agent.personality.fallbackMessage && (
                  <div>
                    <p className="text-xs text-neutral-500 uppercase tracking-wide">Fallback</p>
                    <p className="text-sm text-neutral-800 mt-0.5">{agent.personality.fallbackMessage}</p>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
