import type { ReactNode } from 'react'

type Variant = 'error' | 'warning' | 'info' | 'success'

interface StatusMessageProps {
  variant: Variant
  children: ReactNode
  className?: string
}

const variantStyles: Record<Variant, string> = {
  error: 'bg-red-950/60 border-red-800/50 text-red-300',
  warning: 'bg-yellow-950/60 border-yellow-800/50 text-yellow-300',
  info: 'bg-blue-950/60 border-blue-800/50 text-blue-300',
  success: 'bg-green-950/60 border-green-800/50 text-green-300',
}

const variantIcons: Record<Variant, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
  success: '✓',
}

export function StatusMessage({ variant, children, className = '' }: StatusMessageProps) {
  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${variantStyles[variant]} ${className}`}
    >
      <span className="mt-0.5 shrink-0 font-mono font-bold" aria-hidden>
        {variantIcons[variant]}
      </span>
      <span>{children}</span>
    </div>
  )
}
