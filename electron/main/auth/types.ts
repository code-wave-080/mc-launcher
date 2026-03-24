/**
 * Main-process-only auth types.
 * These extend the shared types with sensitive fields (tokens, expiry, etc.)
 * that must never be forwarded to the renderer process.
 */

import type { AuthSession } from '../../../src/types/auth'

/** Persisted token blob written to disk via TokenStore */
export interface PersistedToken {
  /** Opaque serialised msmc MCToken - treat as a black box */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  msmcToken: any
  savedAt: string
}

/** Internal representation combining the session and persisted data */
export interface ActiveSession {
  session: AuthSession
  persisted: PersistedToken
}
