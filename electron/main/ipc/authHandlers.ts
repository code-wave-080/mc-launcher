import { ipcMain, type BrowserWindow } from 'electron'
import { AUTH_CHANNELS } from './channels'
import { MicrosoftAuthService } from '../auth/MicrosoftAuthService'
import type { AuthSession, IpcResult } from '../../../src/types/auth'

type AuthIpcResult = IpcResult<AuthSession | null>

/**
 * Registers all auth-related IPC handlers.
 * Call once during app startup, after the main window is created.
 *
 * @param mainWindow - Used to push SESSION_CHANGED events to the renderer.
 */
export function registerAuthHandlers(mainWindow: BrowserWindow): void {
  const authService = MicrosoftAuthService.getInstance()

  // -------------------------------------------------------------------------
  // auth:microsoft:login
  // Opens the Microsoft OAuth popup and returns the resulting session.
  // -------------------------------------------------------------------------
  ipcMain.handle(AUTH_CHANNELS.LOGIN_MICROSOFT, async (): Promise<AuthIpcResult> => {
    try {
      const session = await authService.login()
      mainWindow.webContents.send(AUTH_CHANNELS.SESSION_CHANGED, session)
      return { ok: true, data: session }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[IPC auth:microsoft:login]', err)
      return { ok: false, error: message }
    }
  })

  // -------------------------------------------------------------------------
  // auth:refresh-session
  // Attempts to restore a session from disk without user interaction.
  // -------------------------------------------------------------------------
  ipcMain.handle(AUTH_CHANNELS.REFRESH_SESSION, async (): Promise<AuthIpcResult> => {
    try {
      const session = await authService.restoreSession()
      if (session) {
        mainWindow.webContents.send(AUTH_CHANNELS.SESSION_CHANGED, session)
      }
      return { ok: true, data: session }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[IPC auth:refresh-session]', err)
      return { ok: false, error: message }
    }
  })

  // -------------------------------------------------------------------------
  // auth:logout
  // Clears stored credentials and notifies the renderer.
  // -------------------------------------------------------------------------
  ipcMain.handle(AUTH_CHANNELS.LOGOUT, async (): Promise<IpcResult<void>> => {
    try {
      await authService.logout()
      mainWindow.webContents.send(AUTH_CHANNELS.SESSION_CHANGED, null)
      return { ok: true, data: undefined }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[IPC auth:logout]', err)
      return { ok: false, error: message }
    }
  })

  // -------------------------------------------------------------------------
  // auth:get-session
  // Returns the current session if one exists in the store.
  // -------------------------------------------------------------------------
  ipcMain.handle(AUTH_CHANNELS.GET_SESSION, async (): Promise<AuthIpcResult> => {
    try {
      const session = await authService.restoreSession()
      return { ok: true, data: session }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error('[IPC auth:get-session]', err)
      return { ok: false, error: message }
    }
  })
}
