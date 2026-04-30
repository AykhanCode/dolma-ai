import { describe, it, expect } from 'vitest'
import { loginSchema, signupSchema, createAgentSchema, createPostSchema, forgotPasswordSchema } from '@/utils/validators'

describe('Validators', () => {
  describe('loginSchema', () => {
    it('should validate valid login data', async () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
      }
      const result = await loginSchema.parseAsync(validData)
      expect(result).toEqual(validData)
    })

    it('should reject invalid email', async () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Password123!',
      }
      await expect(loginSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject empty password', async () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }
      await expect(loginSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject missing email', async () => {
      await expect(loginSchema.parseAsync({ password: 'Password123!' })).rejects.toThrow()
    })
  })

  describe('signupSchema', () => {
    it('should validate complete signup data', async () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        acceptTerms: true,
        role: 'admin' as const,
      }
      const result = await signupSchema.parseAsync(validData)
      expect(result).toBeDefined()
    })

    it('should reject mismatched passwords', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'DifferentPassword!',
        acceptTerms: true,
        role: 'admin' as const,
      }
      await expect(signupSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject if terms not accepted', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        acceptTerms: false,
        role: 'admin' as const,
      }
      await expect(signupSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject password without uppercase letter', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        acceptTerms: true,
      }
      await expect(signupSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject password without number', async () => {
      const invalidData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'PasswordOnly!',
        confirmPassword: 'PasswordOnly!',
        acceptTerms: true,
      }
      await expect(signupSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject short name', async () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'john@example.com',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!',
        acceptTerms: true,
      }
      await expect(signupSchema.parseAsync(invalidData)).rejects.toThrow()
    })
  })

  describe('createAgentSchema', () => {
    it('should validate agent creation data with required fields', async () => {
      const validData = {
        name: 'Support Bot',
        channels: ['whatsapp'] as const,
      }
      const result = await createAgentSchema.parseAsync(validData)
      expect(result).toBeDefined()
      expect(result.name).toBe('Support Bot')
    })

    it('should validate agent creation data with all fields', async () => {
      const validData = {
        name: 'Support Bot',
        description: 'Customer support agent',
        channels: ['whatsapp', 'instagram'] as const,
        personality: {
          tone: 'professional' as const,
          language: 'en',
          greeting: 'Hello!',
          fallbackMessage: 'I could not understand your request.',
        },
      }
      const result = await createAgentSchema.parseAsync(validData)
      expect(result).toBeDefined()
    })

    it('should reject agent with empty channels', async () => {
      const invalidData = {
        name: 'Support Bot',
        channels: [] as const,
      }
      await expect(createAgentSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject agent with short name', async () => {
      const invalidData = {
        name: 'S',
        channels: ['whatsapp'] as const,
      }
      await expect(createAgentSchema.parseAsync(invalidData)).rejects.toThrow()
    })
  })

  describe('forgotPasswordSchema', () => {
    it('should validate a valid email', async () => {
      const validData = { email: 'user@example.com' }
      const result = await forgotPasswordSchema.parseAsync(validData)
      expect(result).toEqual(validData)
    })

    it('should reject an invalid email', async () => {
      const invalidData = { email: 'not-an-email' }
      await expect(forgotPasswordSchema.parseAsync(invalidData)).rejects.toThrow()
    })
  })

  describe('createPostSchema', () => {
    it('should validate post creation data', async () => {
      const validData = {
        caption: 'Check out our new product!',
        channels: ['instagram'] as const,
      }
      const result = await createPostSchema.parseAsync(validData)
      expect(result).toBeDefined()
    })

    it('should reject empty caption', async () => {
      const invalidData = {
        caption: '',
        channels: ['instagram'] as const,
      }
      await expect(createPostSchema.parseAsync(invalidData)).rejects.toThrow()
    })

    it('should reject empty channels', async () => {
      const invalidData = {
        caption: 'A great caption',
        channels: [] as const,
      }
      await expect(createPostSchema.parseAsync(invalidData)).rejects.toThrow()
    })
  })
})
