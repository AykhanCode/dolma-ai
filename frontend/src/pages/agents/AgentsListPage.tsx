import { Link } from 'react-router-dom'
import { Bot, Edit, Pause, Play, Plus, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { useAgents } from '@/hooks/useAgents'
import { AGENT_STATUSES } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/formatters'
import { SkeletonCard } from '@/components/common/Spinner'
import type { AgentStatus } from '@/types'
import toast from 'react-hot-toast'

export function AgentsListPage() {
  const { agents, isLoading, deployAgent, pauseAgent, deleteAgent } = useAgents()

  const handleDeploy = async (id: string) => {
    try {
      await deployAgent(id)
      toast.success('Agent deployed!')
    } catch {
      toast.error('Failed to deploy agent')
    }
  }

  const handlePause = async (id: string) => {
    try {
      await pauseAgent(id)
      toast.success('Agent paused')
    } catch {
      toast.error('Failed to pause agent')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    try {
      await deleteAgent(id)
      toast.success('Agent deleted')
    } catch {
      toast.error('Failed to delete agent')
    }
  }

  const getStatusVariant = (status: AgentStatus) => {
    const map: Record<AgentStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
      active: 'success',
      draft: 'neutral',
      paused: 'warning',
      archived: 'danger',
    }
    return map[status]
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">AI Agents</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your AI chatbot agents</p>
        </div>
        <Link to="/agents/create">
          <Button icon={<Plus className="w-4 h-4" />}>Create Agent</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : agents.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <Bot className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">No agents yet</h3>
          <p className="text-sm text-neutral-500 mb-6">Create your first AI agent to start automating conversations</p>
          <Link to="/agents/create">
            <Button icon={<Plus className="w-4 h-4" />}>Create your first agent</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} variant="elevated" padding="md" className="group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">{agent.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {formatRelativeTime(agent.updatedAt)}
                    </p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(agent.status)} dot>
                  {AGENT_STATUSES[agent.status].label}
                </Badge>
              </div>

              {agent.description && (
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{agent.description}</p>
              )}

              {/* Channels */}
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.channels.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full capitalize">
                    {ch}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                <Link to={`/agents/${agent.id}`} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full" icon={<Edit className="w-3.5 h-3.5" />}>
                    View
                  </Button>
                </Link>
                {agent.status === 'active' ? (
                  <Button variant="ghost" size="sm" onClick={() => handlePause(agent.id)} icon={<Pause className="w-3.5 h-3.5" />}>
                    Pause
                  </Button>
                ) : agent.status !== 'archived' ? (
                  <Button variant="primary" size="sm" onClick={() => handleDeploy(agent.id)} icon={<Play className="w-3.5 h-3.5" />}>
                    Deploy
                  </Button>
                ) : null}
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Delete agent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
