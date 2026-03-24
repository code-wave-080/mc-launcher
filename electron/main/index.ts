import { app, BrowserWindow, shell } from 'electron'
import { join } from 'path'
import { registerAuthHandlers } from './ipc/authHandlers'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RENDERER_URL = process.env['ELECTRON_RENDERER_URL']
const PRELOAD_PATH = join(__dirname, '../preload/index.js')

// ---------------------------------------------------------------------------
// Window factory
// ---------------------------------------------------------------------------

function createWindow(): BrowserWindow {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    show: false,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0a0a0f',
    webPreferences: {
      preload: PRELOAD_PATH,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  // Gracefully show only after the renderer is ready to avoid flash
  win.once('ready-to-show', () => win.show())

  // Open external links in the OS default browser, not inside Electron
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  if (RENDERER_URL) {
    win.loadURL(RENDERER_URL)
    win.webContents.openDevTools()
  } else {
    win.loadFile(join(__dirname, '../../index.html'))
  }

  return win
}

// ---------------------------------------------------------------------------
// App lifecycle
// ---------------------------------------------------------------------------

app.whenReady().then(() => {
  const mainWindow = createWindow()

  // Register all IPC handlers, injecting the window reference so handlers
  // can push events back to the renderer via webContents.send.
  registerAuthHandlers(mainWindow)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
