import { useEffect, useState } from 'react'
import { contentService } from '@/services/content.service'
import { useBusinessStore } from '@/store/businessStore'
import type { Post } from '@/types'

export function usePosts() {
  const { currentBusiness } = useBusinessStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await contentService.list(currentBusiness?.id)
      setPosts(result.data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [currentBusiness?.id])

  return { posts, isLoading, error, refetch: fetchPosts }
}
