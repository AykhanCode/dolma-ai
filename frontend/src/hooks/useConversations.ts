import { useEffect } from 'react'
import { useConversationStore } from '@/store/conversationStore'

export function useConversations() {
  const store = useConversationStore()

  useEffect(() => {
    store.fetchConversations()
  }, [JSON.stringify(store.filters)])

  return store
}
