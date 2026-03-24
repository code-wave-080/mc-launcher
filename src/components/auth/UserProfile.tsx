import type { AuthSession } from '@/types/auth'

interface UserProfileProps {
  session: AuthSession
  onLogout: () => void
  isLoggingOut?: boolean
}

/**
 * Compact profile card rendered in the sidebar / header once authenticated.
 */
export function UserProfile({ session, onLogout, isLoggingOut = false }: UserProfileProps) {
  const avatarUrl = `https://crafatar.com/avatars/${session.profile.id}?size=64&overlay`

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-surface-600/50 bg-surface-800">
        <img
          src={avatarUrl}
          alt={`${session.profile.name}'s skin`}
          className="h-full w-full object-cover"
          onError={(e) => {
            // Fallback to default Steve head
            ;(e.currentTarget as HTMLImageElement).src =
              'https://crafatar.com/avatars/8667ba71b85a4004af54457a9734eed7?size=64&overlay'
          }}
        />
      </div>

      {/* Name + provider badge */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{session.profile.name}</p>
        <p className="text-xs text-slate-500 capitalize">{session.provider}</p>
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        disabled={isLoggingOut}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-slate-500 hover:bg-surface-700 hover:text-red-400 transition-colors disabled:opacity-50"
        aria-label="Sign out"
      >
        {isLoggingOut ? '…' : 'Sign out'}
      </button>
    </div>
  )
}
