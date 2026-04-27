import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SignupForm } from '@/components/forms/SignupForm'
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

const mockSignup = vi.fn()
const mockOnSuccess = vi.fn()

const renderSignupForm = () =>
  render(
    <MemoryRouter>
      <SignupForm onSuccess={mockOnSuccess} />
    </MemoryRouter>,
  )

describe('SignupForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;vi.mocked(useAuthStore).mockReturnValue({
      signup: mockSignup,
      isLoading: false,
    })
  })

  it('should render all form fields', () => {
    renderSignupForm()
    expect(screen.getByPlaceholderText('John Smith')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Min 8 characters')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Repeat your password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('should render terms and conditions checkbox', () => {
    renderSignupForm()
    expect(screen.getByText(/terms of service/i)).toBeInTheDocument()
  })

  it('should render sign in link', () => {
    renderSignupForm()
    expect(screen.getByText(/sign in/i)).toBeInTheDocument()
  })

  it('should show validation error for missing name', async () => {
    const user = userEvent.setup()
    renderSignupForm()

    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Min 8 characters'), 'Password123!')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'Password123!')
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled()
    })
  })

  it('should show validation error for mismatched passwords', async () => {
    const user = userEvent.setup()
    renderSignupForm()

    await user.type(screen.getByPlaceholderText('John Smith'), 'John Doe')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'test@example.com')
    await user.type(screen.getByPlaceholderText('Min 8 characters'), 'Password123!')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'DifferentPassword!')
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('should call signup with valid form data', async () => {
    mockSignup.mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderSignupForm()

    await user.type(screen.getByPlaceholderText('John Smith'), 'John Doe')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Min 8 characters'), 'Password123!')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'Password123!')

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'john@example.com',
        'Password123!',
        'John Doe',
        expect.any(String),
      )
    })
  })

  it('should call onSuccess after successful signup', async () => {
    mockSignup.mockResolvedValue(undefined)
    const user = userEvent.setup()
    renderSignupForm()

    await user.type(screen.getByPlaceholderText('John Smith'), 'John Doe')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Min 8 characters'), 'Password123!')
    await user.type(screen.getByPlaceholderText('Repeat your password'), 'Password123!')
    await user.click(screen.getByRole('checkbox'))
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled()
    })
  })

  it('should toggle password visibility', async () => {
    const user = userEvent.setup()
    renderSignupForm()

    const passwordInput = screen.getByPlaceholderText('Min 8 characters') as HTMLInputElement
    expect(passwordInput.type).toBe('password')

    await user.click(screen.getByLabelText('Show password'))
    expect(passwordInput.type).toBe('text')
  })

  it('should disable button when loading', () => {
    ;vi.mocked(useAuthStore).mockReturnValue({
      signup: mockSignup,
      isLoading: true,
    })
    renderSignupForm()
    expect(screen.getByRole('button', { name: /create account/i })).toBeDisabled()
  })
})
