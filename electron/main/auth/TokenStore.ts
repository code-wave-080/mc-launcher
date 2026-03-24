import { app, safeStorage } from 'electron'
import fs from 'fs/promises'
import path from 'path'
import type { PersistedToken } from './types'

const TOKEN_FILE = 'auth-token.enc'

/**
 * Persists the MSMC token blob to disk using Electron's safeStorage
 * (OS-level encryption via Keychain / DPAPI / libsecret).
 *
 * Falls back to plain JSON storage when safeStorage is unavailable
 * (e.g., headless CI environments).
 */
export class TokenStore {
  private readonly filePath: string

  constructor() {
    this.filePath = path.join(app.getPath('userData'), TOKEN_FILE)
  }

  async save(token: PersistedToken): Promise<void> {
    const json = JSON.stringify(token)

    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(json)
      await fs.writeFile(this.filePath, encrypted)
    } else {
      await fs.writeFile(this.filePath, json, 'utf-8')
    }
  }

  async load(): Promise<PersistedToken | null> {
    try {
      if (safeStorage.isEncryptionAvailable()) {
        const encrypted = await fs.readFile(this.filePath)
        const json = safeStorage.decryptString(encrypted)
        return JSON.parse(json) as PersistedToken
      } else {
        const json = await fs.readFile(this.filePath, 'utf-8')
        return JSON.parse(json) as PersistedToken
      }
    } catch {
      // File doesn't exist or decryption failed — treat as no session
      return null
    }
  }

  async clear(): Promise<void> {
    try {
      await fs.unlink(this.filePath)
    } catch {
      // Already gone — no-op
    }
  }
}
