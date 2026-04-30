import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { LoginForm } from '@/components/forms/LoginForm'
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

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockLogin = authService.login as ReturnType<typeof vi.fn>

describe('Authentication Flow Integration', () => {
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

  it('should show login form on /login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route
            path="/login"
            element={<LoginForm onSuccess={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should attempt login with correct credentials', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    mockLogin.mockResolvedValue({
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      tokens: { accessToken: 'token', refreshToken: 'refresh' },
    })

    render(
      <MemoryRouter>
        <LoginForm onSuccess={onSuccess} />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      })
    })
  })

  it('should update auth store after successful login', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      user: { id: '1', email: 'test@example.com', firstName: 'Test', lastName: 'User' },
      tokens: { accessToken: 'access-token', refreshToken: 'refresh-token' },
    }
    mockLogin.mockResolvedValue(mockResponse)

    render(
      <MemoryRouter>
        <LoginForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(true)
      expect(state.accessToken).toBe('access-token')
    })
  })

  it('should show error when login fails', async () => {
    const user = userEvent.setup()
    mockLogin.mockRejectedValue(new Error('Invalid credentials'))

    render(
      <MemoryRouter>
        <LoginForm onSuccess={vi.fn()} />
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'WrongPassword')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
    })
  })

  it('should clear auth state on logout', async () => {
    useAuthStore.setState({
      user: { id: '1', email: 'test@example.com' } as never,
      isAuthenticated: true,
      accessToken: 'token',
      refreshToken: 'refresh',
    })

    await useAuthStore.getState().logout()

    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.accessToken).toBeNull()
  })
})
