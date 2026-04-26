import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { CreateAgentForm } from '@/components/forms/CreateAgentForm'

export function CreateAgentPage() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/agents')}
        >
          Back to Agents
        </Button>
      </div>

      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Create AI Agent</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Configure your AI agent to automate customer conversations
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <CardTitle className="mb-6">Agent Configuration</CardTitle>
          <CreateAgentForm
            onSuccess={() => navigate('/agents')}
            onCancel={() => navigate('/agents')}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
