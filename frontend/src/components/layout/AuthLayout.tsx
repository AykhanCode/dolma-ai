import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary-200 transition-shadow">
              <span className="text-white font-bold text-xl">D</span>
            </div>
            <span className="text-2xl font-bold text-neutral-900">DOLMA AI</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-neutral-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-neutral-600">{subtitle}</p>}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-xs text-neutral-400">
          &copy; {new Date().getFullYear()} DOLMA AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}
