/**
 * Re-export the canonical channel constants from shared types.
 * Having this file in the main-process tree lets us import without
 * a relative path back to src/.
 */
export { AUTH_CHANNELS } from '../../../src/types/auth'
