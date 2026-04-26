import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/auth.service'

vi.mock('@/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
    getCurrentUser: vi.fn(),
    refreshToken: vi.fn(),
  },
}))

const mockLogin = authService.login as ReturnType<typeof vi.fn>
const mockSignup = authService.signup as ReturnType<typeof vi.fn>
const mockLogout = authService.logout as ReturnType<typeof vi.fn>
const mockGetCurrentUser = authService.getCurrentUser as ReturnType<typeof vi.fn>

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
    })
    localStorage.clear()
  })

  describe('login', () => {
    it('should login user successfully and set auth state', async () => {
      const mockResponse = {
        user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
      }
      mockLogin.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.login('test@example.com', 'password123')
      })

      expect(result.current.accessToken).toBe('access-token')
      expect(result.current.refreshToken).toBe('refresh-token')
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.user).toEqual(mockResponse.user)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle login error and update error state', async () => {
      const error = new Error('Invalid credentials')
      mockLogin.mockRejectedValue(error)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await expect(result.current.login('test@example.com', 'wrong')).rejects.toThrow('Invalid credentials')
      })

      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.accessToken).toBeNull()
      expect(result.current.error).toBe('Invalid credentials')
    })
  })

  describe('signup', () => {
    it('should signup user successfully', async () => {
      const mockResponse = {
        user: { id: '2', email: 'new@example.com', firstName: 'New', lastName: 'User' },
        tokens: { accessToken: 'new-token', refreshToken: 'new-refresh' },
      }
      mockSignup.mockResolvedValue(mockResponse)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.signup('new@example.com', 'Password123!', 'New User', 'admin')
      })

      expect(result.current.user).toEqual(mockResponse.user)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.accessToken).toBe('new-token')
    })

    it('should handle signup error', async () => {
      const error = new Error('Email already in use')
      mockSignup.mockRejectedValue(error)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await expect(result.current.signup('existing@example.com', 'Password123!', 'User')).rejects.toThrow()
      })

      expect(result.current.isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear auth state on logout', async () => {
      useAuthStore.setState({
        user: { id: '1', email: 'test@example.com' } as never,
        isAuthenticated: true,
        accessToken: 'token',
        refreshToken: 'refresh-token',
      })
      mockLogout.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.accessToken).toBeNull()
      expect(result.current.refreshToken).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })

    it('should clear local storage on logout', async () => {
      localStorage.setItem('accessToken', 'token')
      localStorage.setItem('refreshToken', 'refresh')
      mockLogout.mockResolvedValue(undefined)

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.logout()
      })

      expect(localStorage.getItem('accessToken')).toBeNull()
      expect(localStorage.getItem('refreshToken')).toBeNull()
    })
  })

  describe('fetchCurrentUser', () => {
    it('should fetch and set current user when token exists', async () => {
      const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
      mockGetCurrentUser.mockResolvedValue(mockUser)
      useAuthStore.setState({ accessToken: 'valid-token' })

      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.fetchCurrentUser()
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
    })

    it('should not fetch user when no token', async () => {
      const { result } = renderHook(() => useAuthStore())

      await act(async () => {
        await result.current.fetchCurrentUser()
      })

      expect(mockGetCurrentUser).not.toHaveBeenCalled()
    })
  })

  describe('clearError', () => {
    it('should clear error state', () => {
      useAuthStore.setState({ error: 'Some error' })
      const { result } = renderHook(() => useAuthStore())

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })
  })
})
