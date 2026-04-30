import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    if (store.accessToken && !store.user) {
      store.fetchCurrentUser()
    }
  }, [store.accessToken])

  return store
}
