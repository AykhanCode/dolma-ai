import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/helpers'
import { Spinner } from './Spinner'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

const variants = {
  primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white border border-transparent',
  secondary: 'bg-white hover:bg-neutral-50 active:bg-neutral-100 text-primary-600 border border-primary-500',
  ghost: 'bg-transparent hover:bg-neutral-100 active:bg-neutral-200 text-neutral-700 border border-transparent',
  danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white border border-transparent',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-lg gap-2',
  lg: 'px-6 py-3 text-base rounded-lg gap-2',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, children, className, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? <Spinner size="sm" /> : icon}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'
