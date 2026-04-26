import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Business } from '@/types'
import { businessesService } from '@/services/businesses.service'

interface BusinessState {
  businesses: Business[]
  currentBusiness: Business | null
  isLoading: boolean
  error: string | null
  fetchBusinesses: () => Promise<void>
  selectBusiness: (business: Business) => void
  createBusiness: (dto: Partial<Business>) => Promise<Business>
  updateBusiness: (id: string, dto: Partial<Business>) => Promise<void>
  deleteBusiness: (id: string) => Promise<void>
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      businesses: [],
      currentBusiness: null,
      isLoading: false,
      error: null,

      fetchBusinesses: async () => {
        set({ isLoading: true, error: null })
        try {
          const businesses = await businessesService.list()
          const current = get().currentBusiness
          set({
            businesses,
            currentBusiness: current || businesses[0] || null,
            isLoading: false,
          })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to load businesses'
          set({ error: message, isLoading: false })
        }
      },

      selectBusiness: (business) => set({ currentBusiness: business }),

      createBusiness: async (dto) => {
        const business = await businessesService.create(dto)
        set((state) => ({
          businesses: [...state.businesses, business],
          currentBusiness: state.currentBusiness || business,
        }))
        return business
      },

      updateBusiness: async (id, dto) => {
        const updated = await businessesService.update(id, dto)
        set((state) => ({
          businesses: state.businesses.map((b) => (b.id === id ? updated : b)),
          currentBusiness: state.currentBusiness?.id === id ? updated : state.currentBusiness,
        }))
      },

      deleteBusiness: async (id) => {
        await businessesService.delete(id)
        set((state) => ({
          businesses: state.businesses.filter((b) => b.id !== id),
          currentBusiness: state.currentBusiness?.id === id ? state.businesses[0] || null : state.currentBusiness,
        }))
      },
    }),
    {
      name: 'dolma-business',
      partialize: (state) => ({
        currentBusiness: state.currentBusiness,
      }),
    },
  ),
)
