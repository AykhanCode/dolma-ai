import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/common/Input'

describe('Input Component', () => {
  it('should render an input element', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should render a label when provided', () => {
    render(<Input label="Email address" />)
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
  })

  it('should show error message when error prop is provided', () => {
    render(<Input error="This field is required" />)
    expect(screen.getByText('This field is required')).toBeInTheDocument()
  })

  it('should show hint message when hint prop is provided', () => {
    render(<Input hint="Enter your email" />)
    expect(screen.getByText('Enter your email')).toBeInTheDocument()
  })

  it('should not show hint when error is also provided', () => {
    render(<Input error="Error message" hint="Hint message" />)
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.queryByText('Hint message')).not.toBeInTheDocument()
  })

  it('should apply error styles when error is present', () => {
    render(<Input error="Invalid" />)
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('should render left icon when provided', () => {
    render(<Input leftIcon={<span data-testid="left-icon">@</span>} />)
    expect(screen.getByTestId('left-icon')).toBeInTheDocument()
  })

  it('should render right icon when provided', () => {
    render(<Input rightIcon={<span data-testid="right-icon">X</span>} />)
    expect(screen.getByTestId('right-icon')).toBeInTheDocument()
  })

  it('should forward additional props to the input element', () => {
    render(<Input type="email" required data-testid="email-input" />)
    const input = screen.getByTestId('email-input')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toBeRequired()
  })
})
