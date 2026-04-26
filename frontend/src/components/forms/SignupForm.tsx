import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { signupSchema, type SignupFormData } from '@/utils/validators'
import { useAuthStore } from '@/store/authStore'
import { USER_ROLES } from '@/utils/constants'
import toast from 'react-hot-toast'

interface SignupFormProps {
  onSuccess: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { signup, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'admin' },
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email, data.password, data.name, data.role)
      toast.success('Account created successfully!')
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Signup failed'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full name"
        type="text"
        placeholder="John Smith"
        leftIcon={<User className="w-4 h-4" />}
        error={errors.name?.message}
        autoComplete="name"
        {...register('name')}
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        leftIcon={<Mail className="w-4 h-4" />}
        error={errors.email?.message}
        autoComplete="email"
        {...register('email')}
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Min 8 characters"
        leftIcon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-neutral-400 hover:text-neutral-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
        error={errors.password?.message}
        autoComplete="new-password"
        {...register('password')}
      />

      <Input
        label="Confirm password"
        type={showPassword ? 'text' : 'password'}
        placeholder="Repeat your password"
        leftIcon={<Lock className="w-4 h-4" />}
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
        {...register('confirmPassword')}
      />

      <Select
        label="Role"
        options={USER_ROLES}
        error={errors.role?.message}
        {...register('role')}
      />

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-neutral-300 text-primary-500"
          {...register('acceptTerms')}
        />
        <span className="text-sm text-neutral-600">
          I agree to the{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-600 hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>
      {errors.acceptTerms && (
        <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>
      )}

      <Button type="submit" className="w-full" loading={isLoading} size="lg">
        Create account
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}
