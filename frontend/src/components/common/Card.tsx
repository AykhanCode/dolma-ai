import { cn } from '@/utils/helpers'

export interface CardProps {
  variant?: 'elevated' | 'bordered' | 'ghost'
  padding?: 'sm' | 'md' | 'lg' | 'none'
  hover?: boolean
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

const variants = {
  elevated: 'bg-white shadow-sm border border-neutral-100',
  bordered: 'bg-white border border-neutral-200',
  ghost: 'bg-neutral-50',
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export function Card({
  variant = 'elevated',
  padding = 'md',
  hover = false,
  className,
  children,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl',
        variants[variant],
        paddings[padding],
        hover && 'hover:shadow-md transition-shadow duration-200 cursor-pointer',
        onClick && 'cursor-pointer',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-lg font-semibold text-neutral-900', className)}>{children}</h3>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-neutral-600 text-sm', className)}>{children}</div>
}
