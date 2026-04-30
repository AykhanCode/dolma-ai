import { Link } from 'react-router-dom'
import { Calendar, Grid, List, Plus, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Badge } from '@/components/common/Badge'
import { usePosts } from '@/hooks/usePosts'
import { POST_STATUSES } from '@/utils/constants'
import { formatDateTime } from '@/utils/formatters'
import { SkeletonCard } from '@/components/common/Spinner'
import { contentService } from '@/services/content.service'
import type { PostStatus } from '@/types'
import toast from 'react-hot-toast'
import { useState } from 'react'

function getStatusVariant(status: PostStatus) {
  const map: Record<PostStatus, 'neutral' | 'info' | 'success' | 'danger'> = {
    draft: 'neutral', scheduled: 'info', published: 'success', failed: 'danger',
  }
  return map[status]
}

export function ContentManagerPage() {
  const { posts, isLoading, refetch } = usePosts()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')

  const filteredPosts = statusFilter === 'all' ? posts : posts.filter((p) => p.status === statusFilter)

  const handlePublish = async (id: string) => {
    try {
      await contentService.publish(id)
      toast.success('Post published!')
      refetch()
    } catch {
      toast.error('Failed to publish post')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return
    try {
      await contentService.delete(id)
      toast.success('Post deleted')
      refetch()
    } catch {
      toast.error('Failed to delete post')
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Content Manager</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your social media posts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-primary-light text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-primary-light text-primary-700' : 'text-neutral-500 hover:bg-neutral-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Link to="/content/create">
            <Button icon={<Plus className="w-4 h-4" />}>New Post</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'draft', 'scheduled', 'published', 'failed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 text-sm rounded-full border transition-colors capitalize ${
              statusFilter === status
                ? 'bg-primary-500 text-white border-primary-500'
                : 'border-neutral-200 text-neutral-600 hover:border-primary-400'
            }`}
          >
            {status === 'all' ? 'All Posts' : POST_STATUSES[status].label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {Array(6).fill(null).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card variant="bordered" padding="lg" className="text-center">
          <Calendar className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">No posts yet</h3>
          <p className="text-sm text-neutral-500 mb-6">Create your first social media post</p>
          <Link to="/content/create">
            <Button icon={<Plus className="w-4 h-4" />}>Create your first post</Button>
          </Link>
        </Card>
      ) : (
        <div className={`grid gap-4 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredPosts.map((post) => (
            <Card key={post.id} variant="elevated" padding="md">
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post"
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm text-neutral-800 line-clamp-3 flex-1">{post.caption}</p>
                <Badge variant={getStatusVariant(post.status)}>
                  {POST_STATUSES[post.status].label}
                </Badge>
              </div>

              {/* Channels */}
              <div className="flex flex-wrap gap-1 mb-3">
                {post.channels.map((ch) => (
                  <span key={ch} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 text-xs rounded-full capitalize">
                    {ch}
                  </span>
                ))}
              </div>

              {post.scheduledAt && (
                <p className="text-xs text-neutral-500 mb-3">
                  Scheduled: {formatDateTime(post.scheduledAt)}
                </p>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-neutral-100">
                {post.status === 'draft' && (
                  <Button size="sm" className="flex-1" onClick={() => handlePublish(post.id)}>
                    Publish
                  </Button>
                )}
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors ml-auto"
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
