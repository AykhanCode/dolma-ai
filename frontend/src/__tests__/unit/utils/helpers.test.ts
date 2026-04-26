import { describe, it, expect, vi, beforeEach } from 'vitest'
import { cn, getInitials, getAvatarColor, generateId, sleep, debounce } from '@/utils/helpers'

describe('Helpers', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar')
    })

    it('should handle conditional classes', () => {
      expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz')
    })

    it('should handle undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
    })

    it('should merge tailwind classes correctly', () => {
      const result = cn('px-4', 'px-6')
      expect(result).toBe('px-6')
    })
  })

  describe('getInitials', () => {
    it('should return initials for a full name', () => {
      expect(getInitials('John Doe')).toBe('JD')
    })

    it('should return single letter for one-word name', () => {
      expect(getInitials('Alice')).toBe('A')
    })

    it('should return at most 2 characters', () => {
      expect(getInitials('John Michael Doe')).toBe('JM')
    })

    it('should return uppercase initials', () => {
      expect(getInitials('john doe')).toBe('JD')
    })
  })

  describe('getAvatarColor', () => {
    it('should return a bg color class', () => {
      const result = getAvatarColor('John')
      expect(result).toMatch(/^bg-\w+-500$/)
    })

    it('should return consistent colors for the same input', () => {
      const result1 = getAvatarColor('Alice')
      const result2 = getAvatarColor('Alice')
      expect(result1).toBe(result2)
    })

    it('should return different colors for different inputs', () => {
      const color1 = getAvatarColor('A')
      const color2 = getAvatarColor('H')
      expect(color1).not.toBe(color2)
    })
  })

  describe('generateId', () => {
    it('should generate a non-empty string', () => {
      const id = generateId()
      expect(id).toBeTruthy()
      expect(typeof id).toBe('string')
    })

    it('should generate unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })
  })

  describe('sleep', () => {
    it('should resolve after specified ms', async () => {
      vi.useFakeTimers()
      const promise = sleep(100)
      vi.advanceTimersByTime(100)
      await promise
      vi.useRealTimers()
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    it('should debounce function calls', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced()
      debounced()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to the debounced function', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced('arg1', 'arg2')
      vi.advanceTimersByTime(100)

      expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
    })

    it('should reset timer on repeated calls', () => {
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      vi.advanceTimersByTime(50)
      debounced()
      vi.advanceTimersByTime(50)

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(50)
      expect(fn).toHaveBeenCalledTimes(1)
    })

    afterEach(() => {
      vi.useRealTimers()
    })
  })
})
