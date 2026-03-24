import type { AuthSession, IpcResult } from '../../src/types/auth'

/**
 * Augments the global Window interface with the APIs exposed by the preload
 * script via contextBridge.  Import this file in tsconfig.web.json includes
 * so the renderer can access window.electronAPI with full type safety.
 */
declare global {
  interface Window {
    electronAPI: {
      auth: {
        loginWithMicrosoft: () => Promise<IpcResult<AuthSession | null>>
        refreshSession: () => Promise<IpcResult<AuthSession | null>>
        logout: () => Promise<IpcResult<void>>
        getSession: () => Promise<IpcResult<AuthSession | null>>
        onSessionChanged: (callback: (session: AuthSession | null) => void) => () => void
      }
    }
  }
}

export {}
