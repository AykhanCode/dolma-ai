import { useEffect } from 'react'
import { useAgentStore } from '@/store/agentStore'
import { useBusinessStore } from '@/store/businessStore'

export function useAgents() {
  const store = useAgentStore()
  const { currentBusiness } = useBusinessStore()

  useEffect(() => {
    store.fetchAgents(currentBusiness?.id)
  }, [currentBusiness?.id])

  return store
}
