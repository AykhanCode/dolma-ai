import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/common/Button'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Page not found</h1>
        <p className="text-neutral-500 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>
        <Link to="/dashboard">
          <Button icon={<Home className="w-4 h-4" />} size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
