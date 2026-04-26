import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { SignupForm } from '@/components/forms/SignupForm'

export function SignupPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start your free trial with DOLMA AI"
    >
      <SignupForm onSuccess={() => navigate('/dashboard')} />
    </AuthLayout>
  )
}
