import { cn } from '@/utils/helpers'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: 'primary' | 'white' | 'neutral'
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-10 h-10 border-3',
}

const colors = {
  primary: 'border-primary-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  neutral: 'border-neutral-400 border-t-transparent',
}

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'rounded-full animate-spin',
        sizes[size],
        colors[color],
        className,
      )}
      role="status"
      aria-label="Loading"
    />
  )
}

export function FullPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  )
}

export function SkeletonLine({ className }: { className?: string }) {
  return (
    <div className={cn('bg-neutral-200 rounded animate-pulse', className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-3">
      <SkeletonLine className="h-5 w-1/3" />
      <SkeletonLine className="h-4 w-2/3" />
      <SkeletonLine className="h-4 w-1/2" />
    </div>
  )
}
