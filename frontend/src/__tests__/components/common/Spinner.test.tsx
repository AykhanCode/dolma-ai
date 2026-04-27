import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner, FullPageSpinner } from '@/components/common/Spinner'

describe('Spinner Component', () => {
  it('should render with default props', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('should have aria-label Loading', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('should apply sm size class', () => {
    render(<Spinner size="sm" />)
    expect(screen.getByRole('status')).toHaveClass('w-4', 'h-4')
  })

  it('should apply md size class by default', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveClass('w-6', 'h-6')
  })

  it('should apply lg size class', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByRole('status')).toHaveClass('w-10', 'h-10')
  })

  it('should apply primary color by default', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveClass('border-primary-500')
  })

  it('should apply white color class', () => {
    render(<Spinner color="white" />)
    expect(screen.getByRole('status')).toHaveClass('border-white')
  })

  it('should apply custom className', () => {
    render(<Spinner className="my-custom" />)
    expect(screen.getByRole('status')).toHaveClass('my-custom')
  })
})

describe('FullPageSpinner', () => {
  it('should render a spinner inside a full-page container', () => {
    render(<FullPageSpinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
