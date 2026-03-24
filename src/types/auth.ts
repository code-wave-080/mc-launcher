/**
 * Shared auth types used by both the main process and renderer.
 * Keep this file free of Node.js or browser-specific imports.
 */

export type AuthProvider = 'microsoft'

export interface MinecraftProfile {
  /** Minecraft UUID (without hyphens) */
  id: string
  /** In-game username */
  name: string
}

export interface AuthSession {
  provider: AuthProvider
  /** Minecraft access token for game launch */
  accessToken: string
  profile: MinecraftProfile
  /** ISO timestamp of when the session was established */
  createdAt: string
}

// ---------------------------------------------------------------------------
// IPC channel constants (single source of truth for main ↔ renderer)
// ---------------------------------------------------------------------------

export const AUTH_CHANNELS = {
  // Renderer → Main (ipcRenderer.invoke)
  LOGIN_MICROSOFT: 'auth:microsoft:login',
  REFRESH_SESSION: 'auth:refresh-session',
  LOGOUT: 'auth:logout',
  GET_SESSION: 'auth:get-session',

  // Main → Renderer (ipcMain.emit / ipcRenderer.on)
  SESSION_CHANGED: 'auth:session-changed',
} as const

export type AuthChannel = (typeof AUTH_CHANNELS)[keyof typeof AUTH_CHANNELS]

// ---------------------------------------------------------------------------
// IPC response envelope
// ---------------------------------------------------------------------------

export type IpcResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }
