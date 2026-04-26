import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { loginSchema, type LoginFormData } from '@/utils/validators'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      toast.success('Welcome back!')
      onSuccess()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials'
      toast.error(message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        placeholder="••••••••"
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
        autoComplete="current-password"
        {...register('password')}
      />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded border-neutral-300 text-primary-500" />
          <span className="text-neutral-600">Remember me</span>
        </label>
        <Link to="/forgot-password" className="text-primary-600 hover:text-primary-700 font-medium">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" loading={isLoading} size="lg">
        Sign in
      </Button>

      <p className="text-center text-sm text-neutral-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
    </form>
  )
}
