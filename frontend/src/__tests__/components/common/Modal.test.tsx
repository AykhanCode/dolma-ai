import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal, ModalActions } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'

describe('Modal Component', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()}>
        Hidden content
      </Modal>,
    )
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        Visible content
      </Modal>,
    )
    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('should render title when provided', () => {
    render(
      <Modal isOpen onClose={vi.fn()} title="My Modal">
        Content
      </Modal>,
    )
    expect(screen.getByText('My Modal')).toBeInTheDocument()
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-labelledby', 'modal-title')
  })

  it('should render close button by default', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        Content
      </Modal>,
    )
    expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument()
  })

  it('should not render close button when showCloseButton is false', () => {
    render(
      <Modal isOpen onClose={vi.fn()} showCloseButton={false}>
        Content
      </Modal>,
    )
    expect(screen.queryByRole('button', { name: /close modal/i })).not.toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen onClose={handleClose}>
        Content
      </Modal>,
    )
    fireEvent.click(screen.getByRole('button', { name: /close modal/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when overlay is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen onClose={handleClose}>
        Content
      </Modal>,
    )
    // The overlay is an aria-hidden div - find it
    const overlay = document.querySelector('[aria-hidden="true"]')!
    fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen onClose={handleClose}>
        Content
      </Modal>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should render footer when provided', () => {
    render(
      <Modal isOpen onClose={vi.fn()} footer={<Button>Confirm</Button>}>
        Content
      </Modal>,
    )
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
  })

  it('should have role="dialog" and aria-modal="true"', () => {
    render(
      <Modal isOpen onClose={vi.fn()}>
        Content
      </Modal>,
    )
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })
})

describe('ModalActions Component', () => {
  it('should render cancel and confirm buttons', () => {
    render(
      <ModalActions onCancel={vi.fn()} onConfirm={vi.fn()} />,
    )
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument()
  })

  it('should call onCancel when cancel button is clicked', () => {
    const handleCancel = vi.fn()
    render(<ModalActions onCancel={handleCancel} onConfirm={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalledTimes(1)
  })

  it('should call onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn()
    render(<ModalActions onCancel={vi.fn()} onConfirm={handleConfirm} />)
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }))
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('should render custom labels', () => {
    render(
      <ModalActions
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
        cancelLabel="Dismiss"
        confirmLabel="Delete"
      />,
    )
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
  })

  it('should disable confirm button when loading', () => {
    render(<ModalActions onCancel={vi.fn()} onConfirm={vi.fn()} isLoading />)
    expect(screen.getByRole('button', { name: /confirm/i })).toBeDisabled()
  })
})
