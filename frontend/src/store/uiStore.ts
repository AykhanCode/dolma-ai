import { create } from 'zustand'

interface UiState {
  isSidebarOpen: boolean
  isDarkMode: boolean
  isMobileMenuOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleDarkMode: () => void
  toggleMobileMenu: () => void
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: true,
  isDarkMode: false,
  isMobileMenuOpen: false,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode
      if (next) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { isDarkMode: next }
    }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
}))
