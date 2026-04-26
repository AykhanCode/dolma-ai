import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAgentStore } from '@/store/agentStore'
import { agentsService } from '@/services/agents.service'
import type { Agent } from '@/types'

vi.mock('@/services/agents.service', () => ({
  agentsService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    deploy: vi.fn(),
    pause: vi.fn(),
  },
}))

const mockAgentsList = agentsService.list as ReturnType<typeof vi.fn>
const mockAgentsCreate = agentsService.create as ReturnType<typeof vi.fn>
const mockAgentsUpdate = agentsService.update as ReturnType<typeof vi.fn>
const mockAgentsDelete = agentsService.delete as ReturnType<typeof vi.fn>
const mockAgentsDeploy = agentsService.deploy as ReturnType<typeof vi.fn>
const mockAgentsPause = agentsService.pause as ReturnType<typeof vi.fn>

const sampleAgent: Agent = {
  id: '1',
  name: 'Support Bot',
  status: 'active',
  channels: ['whatsapp'],
} as Agent

describe('agentStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAgentStore.setState({
      agents: [],
      currentAgent: null,
      isLoading: false,
      error: null,
    })
  })

  describe('fetchAgents', () => {
    it('should load agents successfully', async () => {
      mockAgentsList.mockResolvedValue({ data: [sampleAgent], total: 1 })

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.fetchAgents()
      })

      expect(result.current.agents).toHaveLength(1)
      expect(result.current.agents[0]).toEqual(sampleAgent)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle fetch error', async () => {
      mockAgentsList.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.fetchAgents()
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.agents).toHaveLength(0)
    })

    it('should filter agents by businessId', async () => {
      mockAgentsList.mockResolvedValue({ data: [sampleAgent], total: 1 })

      await act(async () => {
        await useAgentStore.getState().fetchAgents('business-1')
      })

      expect(mockAgentsList).toHaveBeenCalledWith('business-1')
    })
  })

  describe('setCurrentAgent', () => {
    it('should set current agent', () => {
      const { result } = renderHook(() => useAgentStore())

      act(() => {
        result.current.setCurrentAgent(sampleAgent)
      })

      expect(result.current.currentAgent).toEqual(sampleAgent)
    })

    it('should clear current agent', () => {
      useAgentStore.setState({ currentAgent: sampleAgent })
      const { result } = renderHook(() => useAgentStore())

      act(() => {
        result.current.setCurrentAgent(null)
      })

      expect(result.current.currentAgent).toBeNull()
    })
  })

  describe('createAgent', () => {
    it('should create a new agent and add to list', async () => {
      const newAgent = { ...sampleAgent, id: '2', name: 'New Bot' }
      mockAgentsCreate.mockResolvedValue(newAgent)

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        const created = await result.current.createAgent({ name: 'New Bot', channels: ['whatsapp'] } as never)
        expect(created).toEqual(newAgent)
      })

      expect(result.current.agents).toContainEqual(newAgent)
    })
  })

  describe('updateAgent', () => {
    it('should update an existing agent in the list', async () => {
      useAgentStore.setState({ agents: [sampleAgent] })
      const updatedAgent = { ...sampleAgent, name: 'Updated Bot' }
      mockAgentsUpdate.mockResolvedValue(updatedAgent)

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.updateAgent('1', { name: 'Updated Bot' } as never)
      })

      expect(result.current.agents[0].name).toBe('Updated Bot')
    })

    it('should update currentAgent if it is the updated agent', async () => {
      useAgentStore.setState({ agents: [sampleAgent], currentAgent: sampleAgent })
      const updatedAgent = { ...sampleAgent, name: 'Updated Bot' }
      mockAgentsUpdate.mockResolvedValue(updatedAgent)

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.updateAgent('1', { name: 'Updated Bot' } as never)
      })

      expect(result.current.currentAgent?.name).toBe('Updated Bot')
    })
  })

  describe('deleteAgent', () => {
    it('should remove agent from list', async () => {
      useAgentStore.setState({ agents: [sampleAgent] })
      mockAgentsDelete.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.deleteAgent('1')
      })

      expect(result.current.agents).toHaveLength(0)
    })
  })

  describe('deployAgent', () => {
    it('should update agent status to active', async () => {
      useAgentStore.setState({ agents: [{ ...sampleAgent, status: 'draft' as never }] })
      const deployedAgent = { ...sampleAgent, status: 'active' }
      mockAgentsDeploy.mockResolvedValue(deployedAgent)

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.deployAgent('1')
      })

      expect(result.current.agents[0].status).toBe('active')
    })
  })

  describe('pauseAgent', () => {
    it('should update agent status to paused', async () => {
      useAgentStore.setState({ agents: [sampleAgent] })
      const pausedAgent = { ...sampleAgent, status: 'paused' }
      mockAgentsPause.mockResolvedValue(pausedAgent)

      const { result } = renderHook(() => useAgentStore())

      await act(async () => {
        await result.current.pauseAgent('1')
      })

      expect(result.current.agents[0].status).toBe('paused')
    })
  })
})
