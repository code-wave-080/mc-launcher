import { create } from 'zustand'
import type { AuthSession } from '@/types/auth'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error'

interface AuthState {
  status: AuthStatus
  session: AuthSession | null
  error: string | null
}

interface AuthActions {
  setLoading: () => void
  setSession: (session: AuthSession) => void
  clearSession: () => void
  setError: (message: string) => void
  reset: () => void
}

const initialState: AuthState = {
  status: 'idle',
  session: null,
  error: null,
}

/**
 * Global auth state managed by Zustand.
 * The actual async logic lives in useAuth — this store is the single
 * source of truth for what the UI should render.
 */
export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  ...initialState,

  setLoading: () => set({ status: 'loading', error: null }),

  setSession: (session) =>
    set({ status: 'authenticated', session, error: null }),

  clearSession: () =>
    set({ status: 'unauthenticated', session: null, error: null }),

  setError: (message) =>
    set({ status: 'error', error: message }),

  reset: () => set(initialState),
}))
