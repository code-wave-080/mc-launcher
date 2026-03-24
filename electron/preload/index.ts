import { contextBridge, ipcRenderer } from 'electron'
import { AUTH_CHANNELS } from '../../src/types/auth'
import type { AuthSession, IpcResult } from '../../src/types/auth'

/**
 * The auth API surface exposed to the renderer via contextBridge.
 * Only the methods declared here are accessible — no raw ipcRenderer.
 */
const authAPI = {
  /**
   * Opens the Microsoft OAuth window and resolves with the new session.
   */
  loginWithMicrosoft: (): Promise<IpcResult<AuthSession | null>> =>
    ipcRenderer.invoke(AUTH_CHANNELS.LOGIN_MICROSOFT),

  /**
   * Silently refreshes the stored token and resolves with the session,
   * or null when no valid token is available.
   */
  refreshSession: (): Promise<IpcResult<AuthSession | null>> =>
    ipcRenderer.invoke(AUTH_CHANNELS.REFRESH_SESSION),

  /**
   * Clears stored credentials and ends the current session.
   */
  logout: (): Promise<IpcResult<void>> =>
    ipcRenderer.invoke(AUTH_CHANNELS.LOGOUT),

  /**
   * Returns the current session from the token store, or null.
   */
  getSession: (): Promise<IpcResult<AuthSession | null>> =>
    ipcRenderer.invoke(AUTH_CHANNELS.GET_SESSION),

  /**
   * Subscribes to session-change events pushed by the main process.
   * Returns an unsubscribe function.
   */
  onSessionChanged: (callback: (session: AuthSession | null) => void): (() => void) => {
    const handler = (_event: Electron.IpcRendererEvent, session: AuthSession | null): void => {
      callback(session)
    }
    ipcRenderer.on(AUTH_CHANNELS.SESSION_CHANGED, handler)
    return () => ipcRenderer.removeListener(AUTH_CHANNELS.SESSION_CHANGED, handler)
  },
} as const

contextBridge.exposeInMainWorld('electronAPI', {
  auth: authAPI,
})

// ---------------------------------------------------------------------------
// Type declaration for the renderer — see electron/preload/index.d.ts
// ---------------------------------------------------------------------------
