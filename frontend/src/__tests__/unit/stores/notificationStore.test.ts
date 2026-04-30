import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useNotificationStore } from '@/store/notificationStore'

describe('notificationStore', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useNotificationStore.setState({ notifications: [] })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('addNotification', () => {
    it('should add a notification with a generated id', () => {
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.addNotification({ type: 'success', title: 'Done', message: 'It worked!' })
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0]).toMatchObject({
        type: 'success',
        title: 'Done',
        message: 'It worked!',
      })
      expect(result.current.notifications[0].id).toBeTruthy()
    })

    it('should auto-dismiss notification after duration', () => {
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.addNotification({
          type: 'info',
          title: 'Info',
          message: 'Test',
          duration: 1000,
        })
      })

      expect(result.current.notifications).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.notifications).toHaveLength(0)
    })

    it('should auto-dismiss with default 5000ms duration', () => {
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.addNotification({ type: 'warning', title: 'Warning', message: 'Watch out' })
      })

      expect(result.current.notifications).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(4999)
      })
      expect(result.current.notifications).toHaveLength(1)

      act(() => {
        vi.advanceTimersByTime(1)
      })
      expect(result.current.notifications).toHaveLength(0)
    })

    it('should generate unique ids for multiple notifications', () => {
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.addNotification({ type: 'success', title: 'First', message: '1' })
        result.current.addNotification({ type: 'error', title: 'Second', message: '2' })
      })

      expect(result.current.notifications).toHaveLength(2)
      expect(result.current.notifications[0].id).not.toBe(result.current.notifications[1].id)
    })
  })

  describe('removeNotification', () => {
    it('should remove a notification by id', () => {
      useNotificationStore.setState({
        notifications: [
          { id: '1', type: 'success', title: 'Test', message: '' },
          { id: '2', type: 'error', title: 'Error', message: '' },
        ],
      })
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.removeNotification('1')
      })

      expect(result.current.notifications).toHaveLength(1)
      expect(result.current.notifications[0].id).toBe('2')
    })

    it('should do nothing if id does not exist', () => {
      useNotificationStore.setState({
        notifications: [{ id: '1', type: 'success', title: 'Test', message: '' }],
      })
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.removeNotification('non-existent')
      })

      expect(result.current.notifications).toHaveLength(1)
    })
  })

  describe('clearAll', () => {
    it('should remove all notifications', () => {
      useNotificationStore.setState({
        notifications: [
          { id: '1', type: 'success', title: 'A', message: '' },
          { id: '2', type: 'error', title: 'B', message: '' },
        ],
      })
      const { result } = renderHook(() => useNotificationStore())

      act(() => {
        result.current.clearAll()
      })

      expect(result.current.notifications).toHaveLength(0)
    })
  })
})
