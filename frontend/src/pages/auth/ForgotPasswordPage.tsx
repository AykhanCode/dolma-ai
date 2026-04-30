import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/utils/validators'
import { authService } from '@/services/auth.service'
import toast from 'react-hot-toast'

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data.email)
      setSent(true)
    } catch {
      toast.error('Failed to send reset email. Please try again.')
    }
  }

  return (
    <AuthLayout title="Reset password" subtitle="We'll send you a link to reset your password">
      {sent ? (
        <div className="text-center py-4">
          <CheckCircle className="w-16 h-16 text-primary-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">Check your email</h3>
          <p className="text-sm text-neutral-600 mb-6">
            We sent a password reset link to your email address.
          </p>
          <Link to="/login">
            <Button variant="secondary" className="w-full">
              Back to sign in
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
            Send reset link
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mt-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sign in
          </Link>
        </form>
      )}
    </AuthLayout>
  )
}
