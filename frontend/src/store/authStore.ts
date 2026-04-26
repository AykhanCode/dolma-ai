import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'
import { authService } from '@/services/auth.service'

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role?: string) => Promise<void>
  logout: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { user, tokens } = await authService.login({ email, password })
          localStorage.setItem('accessToken', tokens.accessToken)
          localStorage.setItem('refreshToken', tokens.refreshToken)
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Login failed'
          set({ error: message, isLoading: false })
          throw err
        }
      },

      signup: async (email, password, name, role) => {
        set({ isLoading: true, error: null })
        try {
          const { user, tokens } = await authService.signup({ email, password, name, role: role as never })
          localStorage.setItem('accessToken', tokens.accessToken)
          localStorage.setItem('refreshToken', tokens.refreshToken)
          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Signup failed'
          set({ error: message, isLoading: false })
          throw err
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } finally {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false })
        }
      },

      fetchCurrentUser: async () => {
        const token = get().accessToken || localStorage.getItem('accessToken')
        if (!token) return
        set({ isLoading: true })
        try {
          const user = await authService.getCurrentUser()
          set({ user, isAuthenticated: true, isLoading: false })
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false })
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'dolma-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
