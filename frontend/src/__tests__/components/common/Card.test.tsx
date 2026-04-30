import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/common/Card'

describe('Card Component', () => {
  it('should render children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('should apply elevated variant classes by default', () => {
    render(<Card>Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).toHaveClass('shadow-sm')
    expect(card).toHaveClass('border-neutral-100')
  })

  it('should apply bordered variant classes', () => {
    render(<Card variant="bordered">Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).toHaveClass('border-neutral-200')
  })

  it('should apply ghost variant classes', () => {
    render(<Card variant="ghost">Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).toHaveClass('bg-neutral-50')
  })

  it('should apply padding classes', () => {
    render(<Card padding="sm">Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).toHaveClass('p-4')
  })

  it('should apply no padding when padding is none', () => {
    render(<Card padding="none">Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).not.toHaveClass('p-4')
    expect(card).not.toHaveClass('p-6')
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable</Card>)
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply hover styles when hover is true', () => {
    render(<Card hover>Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).toHaveClass('hover:shadow-md')
  })

  it('should apply custom className', () => {
    render(<Card className="custom-class">Content</Card>)
    const card = screen.getByText('Content').closest('div')!
    expect(card).toHaveClass('custom-class')
  })
})

describe('CardHeader Component', () => {
  it('should render children', () => {
    render(<CardHeader>Header content</CardHeader>)
    expect(screen.getByText('Header content')).toBeInTheDocument()
  })

  it('should apply mb-4 class', () => {
    render(<CardHeader>Header</CardHeader>)
    expect(screen.getByText('Header').closest('div')).toHaveClass('mb-4')
  })
})

describe('CardTitle Component', () => {
  it('should render as h3', () => {
    render(<CardTitle>Title</CardTitle>)
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Title')
  })
})

describe('CardContent Component', () => {
  it('should render children with text-neutral-600 class', () => {
    render(<CardContent>Body text</CardContent>)
    const content = screen.getByText('Body text')
    expect(content).toHaveClass('text-neutral-600')
  })
})
