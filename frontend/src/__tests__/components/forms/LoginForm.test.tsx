import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from '@/components/forms/LoginForm'
import { useAuthStore } from '@/store/authStore'

vi.mock('@/store/authStore', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockUseAuthStore = useAuthStore as ReturnType<typeof vi.fn>

function renderLoginForm(onSuccess = vi.fn()) {
  return render(
    <MemoryRouter>
      <LoginForm onSuccess={onSuccess} />
    </MemoryRouter>,
  )
}

describe('LoginForm Component', () => {
  const mockLogin = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: false,
    })
  })

  it('should render email and password inputs', () => {
    renderLoginForm()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('should render sign in button', () => {
    renderLoginForm()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('should render forgot password link', () => {
    renderLoginForm()
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument()
  })

  it('should render sign up link', () => {
    renderLoginForm()
    expect(screen.getByText(/sign up/i)).toBeInTheDocument()
  })

  it('should not call login when email format is invalid', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    // Use fireEvent.change to bypass native browser email type constraint validation
    fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
      target: { value: 'invalid-email' },
    })
    await user.type(screen.getByPlaceholderText('••••••••'), 'password')
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!)

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled()
    })
  })

  it('should validate empty password on submit', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('should call login with valid credentials', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    mockLogin.mockResolvedValue(undefined)
    renderLoginForm(onSuccess)

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password123')
    })
  })

  it('should call onSuccess after successful login', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    mockLogin.mockResolvedValue(undefined)
    renderLoginForm(onSuccess)

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('••••••••'), 'Password123')
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled()
    })
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    renderLoginForm()

    const passwordInput = screen.getByPlaceholderText('••••••••') as HTMLInputElement
    expect(passwordInput.type).toBe('password')

    const showPasswordButton = screen.getByLabelText(/show password/i)
    await user.click(showPasswordButton)
    expect(passwordInput.type).toBe('text')

    await user.click(screen.getByLabelText(/hide password/i))
    expect(passwordInput.type).toBe('password')
  })

  it('should disable button when loading', () => {
    mockUseAuthStore.mockReturnValue({
      login: mockLogin,
      isLoading: true,
    })
    renderLoginForm()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })
})
