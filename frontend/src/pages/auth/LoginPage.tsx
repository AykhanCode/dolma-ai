import { useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LoginForm } from '@/components/forms/LoginForm'

export function LoginPage() {
  const navigate = useNavigate()

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your DOLMA AI account"
    >
      <LoginForm onSuccess={() => navigate('/dashboard')} />
    </AuthLayout>
  )
}
