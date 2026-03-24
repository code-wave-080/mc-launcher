import { Button } from '@/components/ui/Button'
import { StatusMessage } from '@/components/ui/StatusMessage'

interface LoginScreenProps {
  isLoading: boolean
  error: string | null
  onMicrosoftLogin: () => void
}

/**
 * Full-screen login view displayed when no session is active.
 */
export function LoginScreen({ isLoading, error, onMicrosoftLogin }: LoginScreenProps) {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-surface-950 animate-fade-in">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-900/20 blur-3xl" />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-6 animate-slide-up">
        {/* Logo / wordmark */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-800 border border-surface-700/50 shadow-xl">
            <span className="text-3xl" aria-hidden>
              ⛏
            </span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">MC Launcher</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue</p>
          </div>
        </div>

        {/* Error feedback */}
        {error && (
          <StatusMessage variant="error" className="w-full">
            {error}
          </StatusMessage>
        )}

        {/* Login actions */}
        <div className="flex w-full flex-col gap-3">
          <Button
            size="lg"
            isLoading={isLoading}
            onClick={onMicrosoftLogin}
            className="w-full"
            aria-label="Sign in with Microsoft account"
          >
            {!isLoading && (
              <MicrosoftIcon className="h-5 w-5 shrink-0" aria-hidden />
            )}
            {isLoading ? 'Signing in…' : 'Sign in with Microsoft'}
          </Button>
        </div>

        <p className="text-center text-xs text-slate-600 leading-relaxed">
          Requires a{' '}
          <span className="text-slate-500">Java Edition</span> licence linked to your Microsoft
          account.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inline SVG icon — avoids an extra asset import
// ---------------------------------------------------------------------------
function MicrosoftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 21 21" className={className} aria-hidden="true">
      <rect x="1" y="1" width="9" height="9" fill="#f25022" />
      <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
      <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  )
}
