import { create } from 'zustand'
import type { ToastNotification } from '@/types'

interface NotificationState {
  notifications: ToastNotification[]
  addNotification: (notification: Omit<ToastNotification, 'id'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = { ...notification, id }
    set((state) => ({ notifications: [...state.notifications, newNotification] }))

    // Auto-dismiss
    const duration = notification.duration || 5000
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }))
    }, duration)
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearAll: () => set({ notifications: [] }),
}))
