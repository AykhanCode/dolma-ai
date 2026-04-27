import { z } from 'zod'

export const emailSchema = z.string().email('Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    role: z.enum(['admin', 'manager', 'agent']).optional(),
    acceptTerms: z.boolean().refine((v) => v, 'You must accept the terms'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  industry: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  phone: z.string().optional(),
  email: emailSchema.optional().or(z.literal('')),
  description: z.string().optional(),
})

export const createAgentSchema = z.object({
  name: z.string().min(2, 'Agent name is required'),
  description: z.string().optional(),
  channels: z.array(z.enum(['whatsapp', 'instagram', 'tiktok', 'facebook'])).min(1, 'Select at least one channel'),
  personality: z
    .object({
      tone: z.enum(['professional', 'friendly', 'casual', 'formal']),
      language: z.string(),
      greeting: z.string().optional(),
      fallbackMessage: z.string().optional(),
    })
    .optional(),
})

export const createPostSchema = z.object({
  caption: z.string().min(1, 'Caption is required').max(2200, 'Caption too long'),
  channels: z.array(z.enum(['whatsapp', 'instagram', 'tiktok', 'facebook'])).min(1, 'Select at least one channel'),
  scheduledAt: z.string().optional(),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>
export type CreateBusinessFormData = z.infer<typeof createBusinessSchema>
export type CreateAgentFormData = z.infer<typeof createAgentSchema>
export type CreatePostFormData = z.infer<typeof createPostSchema>
