import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatNumber,
  formatPercent,
  formatCurrency,
  truncate,
  capitalizeFirst,
  slugify,
} from '@/utils/formatters'

describe('Formatters', () => {
  describe('formatDate', () => {
    it('should format a Date object', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDate(date)
      expect(result).toMatch(/Jan\s+15,\s+2024/)
    })

    it('should format an ISO date string', () => {
      const result = formatDate('2024-06-01')
      expect(result).toContain('2024')
    })

    it('should apply a custom format pattern', () => {
      const result = formatDate('2024-01-15', 'yyyy')
      expect(result).toBe('2024')
    })
  })

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const date = new Date('2024-01-15T10:30:00')
      const result = formatDateTime(date)
      expect(result).toMatch(/Jan\s+15,\s+2024/)
      expect(result).toMatch(/10:30/)
    })

    it('should format an ISO date string with time', () => {
      const result = formatDateTime('2024-03-20T14:45:00')
      expect(result).toContain('2024')
    })
  })

  describe('formatRelativeTime', () => {
    it('should format a recent time as relative', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
      const result = formatRelativeTime(fiveMinutesAgo)
      expect(result).toMatch(/minutes? ago/)
    })

    it('should format a date string as relative', () => {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const result = formatRelativeTime(oneHourAgo)
      expect(result).toMatch(/about 1 hour ago|1 hour ago/)
    })
  })

  describe('formatNumber', () => {
    it('should format numbers below 1000 as-is', () => {
      expect(formatNumber(999)).toBe('999')
      expect(formatNumber(0)).toBe('0')
    })

    it('should format thousands with K suffix', () => {
      expect(formatNumber(1000)).toBe('1.0K')
      expect(formatNumber(1500)).toBe('1.5K')
    })

    it('should format millions with M suffix', () => {
      expect(formatNumber(1000000)).toBe('1.0M')
      expect(formatNumber(2500000)).toBe('2.5M')
    })
  })

  describe('formatPercent', () => {
    it('should format a decimal as percentage with 1 decimal', () => {
      expect(formatPercent(85.6)).toBe('85.6%')
    })

    it('should format 100 as 100.0%', () => {
      expect(formatPercent(100)).toBe('100.0%')
    })

    it('should respect custom decimals parameter', () => {
      expect(formatPercent(33.333, 2)).toBe('33.33%')
    })

    it('should format 0 as 0.0%', () => {
      expect(formatPercent(0)).toBe('0.0%')
    })
  })

  describe('formatCurrency', () => {
    it('should format amount as USD currency', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00')
    })

    it('should format decimal amounts', () => {
      expect(formatCurrency(1234.5)).toBe('$1,234.50')
    })

    it('should format zero', () => {
      expect(formatCurrency(0)).toBe('$0.00')
    })
  })

  describe('truncate', () => {
    it('should truncate strings longer than the limit', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...')
    })

    it('should not truncate strings within the limit', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })

    it('should not truncate strings equal to the limit', () => {
      expect(truncate('Hello', 10)).toBe('Hello')
    })
  })

  describe('capitalizeFirst', () => {
    it('should capitalize the first letter', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
    })

    it('should handle already capitalized strings', () => {
      expect(capitalizeFirst('Hello')).toBe('Hello')
    })

    it('should handle empty string', () => {
      expect(capitalizeFirst('')).toBe('')
    })
  })

  describe('slugify', () => {
    it('should convert text to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world')
    })

    it('should collapse multiple dashes', () => {
      expect(slugify('Hello   World')).toBe('hello-world')
    })
  })
})
