import { useEffect } from 'react'
import { useBusinessStore } from '@/store/businessStore'

export function useBusinesses() {
  const store = useBusinessStore()

  useEffect(() => {
    if (store.businesses.length === 0) {
      store.fetchBusinesses()
    }
  }, [])

  return store
}
