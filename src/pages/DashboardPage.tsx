import { UserProfile } from '@/components/auth/UserProfile'
import { useAuth } from '@/hooks/useAuth'

/**
 * Main launcher dashboard — shown after successful authentication.
 * Extend this page with game version selection, news feed, launch button, etc.
 */
export function DashboardPage() {
  const { session, isLoading, logout } = useAuth()

  if (!session) return null

  return (
    <div className="flex h-screen w-screen flex-col bg-surface-950 text-white animate-fade-in">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-surface-800 bg-surface-900 p-4">
        <div className="mb-6">
          <h1 className="text-lg font-bold tracking-tight">MC Launcher</h1>
        </div>

        {/* Nav placeholder */}
        <nav className="flex-1 space-y-1">
          <NavItem label="Play" icon="▶" active />
          <NavItem label="Mods" icon="⚙" />
          <NavItem label="Settings" icon="⚙" />
        </nav>

        {/* Profile at bottom */}
        <div className="border-t border-surface-800 pt-4">
          <UserProfile session={session} onLogout={logout} isLoggingOut={isLoading} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        <div className="text-center animate-slide-up">
          <p className="text-4xl font-bold">Welcome back,</p>
          <p className="mt-1 text-4xl font-bold text-brand-500">{session.profile.name}</p>
        </div>

        {/* Launch button — wire up to game launch logic */}
        <button
          className="mt-4 rounded-xl bg-brand-600 px-12 py-4 text-lg font-bold text-white
                     shadow-lg shadow-brand-900/50 transition hover:bg-brand-500 active:scale-95"
        >
          PLAY
        </button>
      </main>
    </div>
  )
}

function NavItem({ label, icon, active }: { label: string; icon: string; active?: boolean }) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
        ${active ? 'bg-surface-700 text-white' : 'text-slate-500 hover:bg-surface-800 hover:text-slate-300'}`}
    >
      <span className="text-base" aria-hidden>{icon}</span>
      {label}
    </button>
  )
}
