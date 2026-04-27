import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/common/Badge'

describe('Badge Component', () => {
  it('should render children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('should apply default variant classes', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default').closest('span')!
    expect(badge).toHaveClass('bg-primary-light')
  })

  it('should apply success variant classes', () => {
    render(<Badge variant="success">Success</Badge>)
    const badge = screen.getByText('Success').closest('span')!
    expect(badge).toHaveClass('bg-green-100')
    expect(badge).toHaveClass('text-green-700')
  })

  it('should apply warning variant classes', () => {
    render(<Badge variant="warning">Warning</Badge>)
    const badge = screen.getByText('Warning').closest('span')!
    expect(badge).toHaveClass('bg-yellow-100')
    expect(badge).toHaveClass('text-yellow-700')
  })

  it('should apply danger variant classes', () => {
    render(<Badge variant="danger">Danger</Badge>)
    const badge = screen.getByText('Danger').closest('span')!
    expect(badge).toHaveClass('bg-red-100')
    expect(badge).toHaveClass('text-red-700')
  })

  it('should apply info variant classes', () => {
    render(<Badge variant="info">Info</Badge>)
    const badge = screen.getByText('Info').closest('span')!
    expect(badge).toHaveClass('bg-blue-100')
  })

  it('should apply neutral variant classes', () => {
    render(<Badge variant="neutral">Neutral</Badge>)
    const badge = screen.getByText('Neutral').closest('span')!
    expect(badge).toHaveClass('bg-neutral-100')
  })

  it('should apply sm size classes', () => {
    render(<Badge size="sm">Small</Badge>)
    const badge = screen.getByText('Small').closest('span')!
    expect(badge).toHaveClass('px-2')
    expect(badge).toHaveClass('py-0.5')
  })

  it('should apply md size classes by default', () => {
    render(<Badge>Medium</Badge>)
    const badge = screen.getByText('Medium').closest('span')!
    expect(badge).toHaveClass('px-2.5')
    expect(badge).toHaveClass('py-1')
  })

  it('should render dot indicator when dot is true', () => {
    render(<Badge dot>With dot</Badge>)
    const badge = screen.getByText('With dot').closest('span')!
    // The dot span is a sibling of the text
    const dotSpan = badge.querySelector('span')
    expect(dotSpan).toBeInTheDocument()
    expect(dotSpan).toHaveClass('w-1.5')
    expect(dotSpan).toHaveClass('h-1.5')
  })

  it('should not render dot when dot is false', () => {
    render(<Badge>No dot</Badge>)
    const badge = screen.getByText('No dot').closest('span')!
    const dotSpan = badge.querySelector('span')
    expect(dotSpan).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    render(<Badge className="custom">Custom</Badge>)
    const badge = screen.getByText('Custom').closest('span')!
    expect(badge).toHaveClass('custom')
  })
})
