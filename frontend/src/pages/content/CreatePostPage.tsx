import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card, CardTitle } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { CreatePostForm } from '@/components/forms/CreatePostForm'

export function CreatePostPage() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/content')}
        >
          Back to Content
        </Button>
      </div>

      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-900">Create Post</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create and schedule social media content across multiple channels
          </p>
        </div>

        <Card variant="elevated" padding="lg">
          <CardTitle className="mb-6">Post Content</CardTitle>
          <CreatePostForm
            onSuccess={() => navigate('/content')}
            onCancel={() => navigate('/content')}
          />
        </Card>
      </div>
    </DashboardLayout>
  )
}
