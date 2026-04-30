import { describe, it, expect, vi, beforeEach } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '../../mocks/server'
import { authService } from '@/services/auth.service'
import apiClient from '@/lib/api-client'

vi.mock('@/lib/api-client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

const mockPost = apiClient.post as ReturnType<typeof vi.fn>
const mockGet = apiClient.get as ReturnType<typeof vi.fn>

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call the login endpoint with credentials', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
        },
      }
      mockPost.mockResolvedValue(mockResponse)

      const result = await authService.login({ email: 'test@example.com', password: 'Password123' })

      expect(mockPost).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'Password123',
      })
      expect(result).toEqual({
        user: mockResponse.data.user,
        tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
      })
    })
  })

  describe('signup', () => {
    it('should call the signup endpoint with user data', async () => {
      const mockResponse = {
        data: {
          user: { id: '1', email: 'new@example.com' },
          accessToken: 'token',
          refreshToken: 'refresh',
        },
      }
      mockPost.mockResolvedValue(mockResponse)

      const result = await authService.signup({
        email: 'new@example.com',
        password: 'Password123!',
        firstName: 'New',
        lastName: 'User',
      })

      expect(mockPost).toHaveBeenCalledWith('/auth/signup', expect.objectContaining({
        email: 'new@example.com',
        password: 'Password123!',
      }))
      expect(result).toEqual({
        user: mockResponse.data.user,
        tokens: { accessToken: 'token', refreshToken: 'refresh' },
      })
    })
  })

  describe('logout', () => {
    it('should call the logout endpoint', async () => {
      mockPost.mockResolvedValue({ data: {} })

      await authService.logout()

      expect(mockPost).toHaveBeenCalledWith('/auth/logout')
    })
  })

  describe('getCurrentUser', () => {
    it('should call the /auth/me endpoint', async () => {
      const mockUser = { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' }
      mockGet.mockResolvedValue({ data: mockUser })

      const result = await authService.getCurrentUser()

      expect(mockGet).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })
  })

  describe('refreshToken', () => {
    it('should call the refresh endpoint with the token', async () => {
      const mockTokens = { accessToken: 'new-token', refreshToken: 'new-refresh' }
      mockPost.mockResolvedValue({ data: mockTokens })

      const result = await authService.refreshToken('old-refresh-token')

      expect(mockPost).toHaveBeenCalledWith('/auth/refresh', { refreshToken: 'old-refresh-token' })
      expect(result).toEqual(mockTokens)
    })
  })

  describe('forgotPassword', () => {
    it('should call the forgot-password endpoint', async () => {
      mockPost.mockResolvedValue({ data: {} })

      await authService.forgotPassword('user@example.com')

      expect(mockPost).toHaveBeenCalledWith('/auth/forgot-password', { email: 'user@example.com' })
    })
  })
})
