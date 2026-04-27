import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useUiStore } from '@/store/uiStore'

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({
      isSidebarOpen: true,
      isDarkMode: false,
      isMobileMenuOpen: false,
    })
    document.documentElement.classList.remove('dark')
  })

  describe('toggleSidebar', () => {
    it('should toggle sidebar from open to closed', () => {
      const { result } = renderHook(() => useUiStore())

      expect(result.current.isSidebarOpen).toBe(true)

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.isSidebarOpen).toBe(false)
    })

    it('should toggle sidebar from closed to open', () => {
      useUiStore.setState({ isSidebarOpen: false })
      const { result } = renderHook(() => useUiStore())

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.isSidebarOpen).toBe(true)
    })
  })

  describe('setSidebarOpen', () => {
    it('should set sidebar to open', () => {
      useUiStore.setState({ isSidebarOpen: false })
      const { result } = renderHook(() => useUiStore())

      act(() => {
        result.current.setSidebarOpen(true)
      })

      expect(result.current.isSidebarOpen).toBe(true)
    })

    it('should set sidebar to closed', () => {
      const { result } = renderHook(() => useUiStore())

      act(() => {
        result.current.setSidebarOpen(false)
      })

      expect(result.current.isSidebarOpen).toBe(false)
    })
  })

  describe('toggleDarkMode', () => {
    it('should enable dark mode and add dark class to documentElement', () => {
      const { result } = renderHook(() => useUiStore())

      expect(result.current.isDarkMode).toBe(false)

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should disable dark mode and remove dark class', () => {
      useUiStore.setState({ isDarkMode: true })
      document.documentElement.classList.add('dark')
      const { result } = renderHook(() => useUiStore())

      act(() => {
        result.current.toggleDarkMode()
      })

      expect(result.current.isDarkMode).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('toggleMobileMenu', () => {
    it('should toggle mobile menu from closed to open', () => {
      const { result } = renderHook(() => useUiStore())

      expect(result.current.isMobileMenuOpen).toBe(false)

      act(() => {
        result.current.toggleMobileMenu()
      })

      expect(result.current.isMobileMenuOpen).toBe(true)
    })

    it('should toggle mobile menu from open to closed', () => {
      useUiStore.setState({ isMobileMenuOpen: true })
      const { result } = renderHook(() => useUiStore())

      act(() => {
        result.current.toggleMobileMenu()
      })

      expect(result.current.isMobileMenuOpen).toBe(false)
    })
  })
})
