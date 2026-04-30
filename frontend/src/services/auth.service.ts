import apiClient from '@/lib/api-client'
import type { User, AuthTokens, LoginDto, SignupDto } from '@/types'

export const authService = {
  async login(dto: LoginDto): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post('/auth/login', dto)
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    }
  },

  async signup(dto: SignupDto): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await apiClient.post('/auth/signup', dto)
    return {
      user: data.user,
      tokens: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      },
    }
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get('/auth/me')
    return data
  },

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    const { data } = await apiClient.post('/auth/refresh', { refreshToken })
    return data
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.post('/auth/reset-password', { token, password })
  },
}
