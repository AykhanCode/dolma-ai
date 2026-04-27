import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useBusinessStore } from '@/store/businessStore'
import { businessesService } from '@/services/businesses.service'
import type { Business } from '@/types'

vi.mock('@/services/businesses.service', () => ({
  businessesService: {
    list: vi.fn(),
    get: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

const mockList = businessesService.list as ReturnType<typeof vi.fn>
const mockCreate = businessesService.create as ReturnType<typeof vi.fn>
const mockUpdate = businessesService.update as ReturnType<typeof vi.fn>
const mockDelete = businessesService.delete as ReturnType<typeof vi.fn>

const sampleBusiness: Business = {
  id: '1',
  name: 'Test Business',
  industry: 'Technology',
} as Business

describe('businessStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useBusinessStore.setState({
      businesses: [],
      currentBusiness: null,
      isLoading: false,
      error: null,
    })
  })

  describe('fetchBusinesses', () => {
    it('should load businesses successfully', async () => {
      mockList.mockResolvedValue([sampleBusiness])

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.fetchBusinesses()
      })

      expect(result.current.businesses).toHaveLength(1)
      expect(result.current.businesses[0]).toEqual(sampleBusiness)
      expect(result.current.isLoading).toBe(false)
    })

    it('should set first business as current if no current is set', async () => {
      mockList.mockResolvedValue([sampleBusiness])

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.fetchBusinesses()
      })

      expect(result.current.currentBusiness).toEqual(sampleBusiness)
    })

    it('should handle fetch error', async () => {
      mockList.mockRejectedValue(new Error('Network error'))

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.fetchBusinesses()
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.businesses).toHaveLength(0)
    })
  })

  describe('selectBusiness', () => {
    it('should set the current business', () => {
      const { result } = renderHook(() => useBusinessStore())

      act(() => {
        result.current.selectBusiness(sampleBusiness)
      })

      expect(result.current.currentBusiness).toEqual(sampleBusiness)
    })
  })

  describe('createBusiness', () => {
    it('should create a business and add to list', async () => {
      mockCreate.mockResolvedValue(sampleBusiness)

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        const created = await result.current.createBusiness({ name: 'Test Business' })
        expect(created).toEqual(sampleBusiness)
      })

      expect(result.current.businesses).toContainEqual(sampleBusiness)
    })

    it('should set as current business if no current exists', async () => {
      mockCreate.mockResolvedValue(sampleBusiness)

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.createBusiness({ name: 'Test Business' })
      })

      expect(result.current.currentBusiness).toEqual(sampleBusiness)
    })
  })

  describe('updateBusiness', () => {
    it('should update a business in the list', async () => {
      useBusinessStore.setState({ businesses: [sampleBusiness] })
      const updatedBusiness = { ...sampleBusiness, name: 'Updated Business' }
      mockUpdate.mockResolvedValue(updatedBusiness)

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.updateBusiness('1', { name: 'Updated Business' })
      })

      expect(result.current.businesses[0].name).toBe('Updated Business')
    })

    it('should update currentBusiness if it is the updated business', async () => {
      useBusinessStore.setState({
        businesses: [sampleBusiness],
        currentBusiness: sampleBusiness,
      })
      const updatedBusiness = { ...sampleBusiness, name: 'Updated Business' }
      mockUpdate.mockResolvedValue(updatedBusiness)

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.updateBusiness('1', { name: 'Updated Business' })
      })

      expect(result.current.currentBusiness?.name).toBe('Updated Business')
    })
  })

  describe('deleteBusiness', () => {
    it('should remove business from list', async () => {
      useBusinessStore.setState({ businesses: [sampleBusiness] })
      mockDelete.mockResolvedValue(undefined)

      const { result } = renderHook(() => useBusinessStore())

      await act(async () => {
        await result.current.deleteBusiness('1')
      })

      expect(result.current.businesses).toHaveLength(0)
    })
  })
})
