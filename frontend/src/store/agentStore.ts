import { create } from 'zustand'
import type { Agent, CreateAgentDto } from '@/types'
import { agentsService } from '@/services/agents.service'

interface AgentState {
  agents: Agent[]
  currentAgent: Agent | null
  isLoading: boolean
  error: string | null
  fetchAgents: (businessId?: string) => Promise<void>
  setCurrentAgent: (agent: Agent | null) => void
  createAgent: (dto: CreateAgentDto) => Promise<Agent>
  updateAgent: (id: string, dto: Partial<CreateAgentDto>) => Promise<void>
  deleteAgent: (id: string) => Promise<void>
  deployAgent: (id: string) => Promise<void>
  pauseAgent: (id: string) => Promise<void>
}

export const useAgentStore = create<AgentState>()((set) => ({
  agents: [],
  currentAgent: null,
  isLoading: false,
  error: null,

  fetchAgents: async (businessId) => {
    set({ isLoading: true, error: null })
    try {
      const result = await agentsService.list(businessId)
      set({ agents: result.data || [], isLoading: false })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load agents'
      set({ error: message, isLoading: false })
    }
  },

  setCurrentAgent: (agent) => set({ currentAgent: agent }),

  createAgent: async (dto) => {
    const agent = await agentsService.create(dto)
    set((state) => ({ agents: [...state.agents, agent] }))
    return agent
  },

  updateAgent: async (id, dto) => {
    const updated = await agentsService.update(id, dto)
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? updated : a)),
      currentAgent: state.currentAgent?.id === id ? updated : state.currentAgent,
    }))
  },

  deleteAgent: async (id) => {
    await agentsService.delete(id)
    set((state) => ({ agents: state.agents.filter((a) => a.id !== id) }))
  },

  deployAgent: async (id) => {
    const updated = await agentsService.deploy(id)
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? updated : a)),
    }))
  },

  pauseAgent: async (id) => {
    const updated = await agentsService.pause(id)
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? updated : a)),
    }))
  },
}))
