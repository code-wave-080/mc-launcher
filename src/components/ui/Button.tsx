import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  isLoading?: boolean
  leftIcon?: ReactNode
  children: ReactNode
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 active:bg-brand-700 shadow-lg shadow-brand-900/40',
  ghost:
    'bg-surface-700/60 text-slate-300 hover:bg-surface-600 hover:text-white border border-surface-600/50',
  danger:
    'bg-red-900/60 text-red-300 hover:bg-red-800/70 hover:text-red-100 border border-red-800/50',
}

const sizeStyles: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading

  return (
    <button
      {...rest}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-all duration-150 focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-900',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        className,
      ].join(' ')}
    >
      {isLoading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden
        />
      ) : (
        leftIcon
      )}
      {children}
    </button>
  )
}
