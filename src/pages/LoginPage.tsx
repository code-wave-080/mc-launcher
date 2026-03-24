import { LoginScreen } from '@/components/auth/LoginScreen'
import { useAuth } from '@/hooks/useAuth'

/**
 * Thin page wrapper — keeps routing logic separate from presentation.
 */
export function LoginPage() {
  const { isLoading, error, loginWithMicrosoft } = useAuth()

  return (
    <LoginScreen
      isLoading={isLoading}
      error={error}
      onMicrosoftLogin={loginWithMicrosoft}
    />
  )
}
