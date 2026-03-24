import { useAuthStore } from '@/stores/useAuthStore'
import { LoginPage } from '@/pages/LoginPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

/**
 * Root component.  Renders the correct page based on auth state.
 * Add React Router here if routing grows beyond two screens.
 */
export default function App() {
  const status = useAuthStore((s) => s.status)

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-950">
        <LoadingSpinner size="lg" label="Checking session…" />
      </div>
    )
  }

  if (status === 'authenticated') {
    return <DashboardPage />
  }

  // 'unauthenticated' | 'error'
  return <LoginPage />
}
