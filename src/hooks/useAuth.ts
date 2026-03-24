import { useCallback, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import type { AuthSession } from '@/types/auth'

/**
 * Primary auth hook consumed by React components.
 *
 * Responsibilities:
 *  - On mount, attempt a silent token refresh to restore a previous session.
 *  - Subscribe to SESSION_CHANGED events pushed by the main process.
 *  - Expose login / logout actions that delegate to the preload bridge.
 */
export function useAuth() {
  const { status, session, error, setLoading, setSession, clearSession, setError } =
    useAuthStore()

  // ---------------------------------------------------------------------------
  // Initialise: try to restore a previous session on first render
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false

    const restore = async () => {
      setLoading()
      const result = await window.electronAPI.auth.refreshSession()

      if (cancelled) return

      if (!result.ok) {
        clearSession()
        return
      }

      if (result.data) {
        setSession(result.data)
      } else {
        clearSession()
      }
    }

    restore()
    return () => { cancelled = true }
    // Run once on mount — intentionally omitting deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ---------------------------------------------------------------------------
  // Subscribe to session changes pushed from the main process
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const unsubscribe = window.electronAPI.auth.onSessionChanged(
      (updatedSession: AuthSession | null) => {
        if (updatedSession) {
          setSession(updatedSession)
        } else {
          clearSession()
        }
      },
    )
    return unsubscribe
  }, [setSession, clearSession])

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const loginWithMicrosoft = useCallback(async () => {
    setLoading()
    const result = await window.electronAPI.auth.loginWithMicrosoft()

    if (!result.ok) {
      setError(result.error)
      return
    }

    if (result.data) {
      setSession(result.data)
    }
  }, [setLoading, setSession, setError])

  const logout = useCallback(async () => {
    setLoading()
    const result = await window.electronAPI.auth.logout()

    if (!result.ok) {
      setError(result.error)
      return
    }

    clearSession()
  }, [setLoading, clearSession, setError])

  return {
    status,
    session,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || status === 'idle',
    loginWithMicrosoft,
    logout,
  }
}
