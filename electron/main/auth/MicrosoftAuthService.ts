import {Auth} from 'msmc'
import type {Minecraft} from 'msmc'
import type {AuthSession} from '@shared/auth'
import type {PersistedToken} from './types'
import {TokenStore} from './TokenStore'

/**
 * Singleton service that wraps msmc to provide a clean, testable interface
 * for Microsoft OAuth2 / Minecraft authentication.
 *
 * All msmc calls run in the main process so that:
 *  - The OAuth BrowserWindow can be spawned safely.
 *  - Raw tokens never touch the renderer process.
 */
export class MicrosoftAuthService {
    private static _instance: MicrosoftAuthService | null = null

    private readonly msAuth: Auth
    private readonly tokenStore: TokenStore

    private constructor(tokenStore: TokenStore) {
        // 'select_account' forces the MS login prompt every time,
        // preventing silent re-use of stale OS credentials during development.
        this.msAuth = new Auth('select_account')
        this.tokenStore = tokenStore
    }

    static getInstance(): MicrosoftAuthService {
        if (!MicrosoftAuthService._instance) {
            MicrosoftAuthService._instance = new MicrosoftAuthService(new TokenStore())
        }
        return MicrosoftAuthService._instance
    }

    /**
     * Launches the Microsoft OAuth flow inside a child BrowserWindow.
     * Resolves with the resulting AuthSession once the user authenticates.
     */
    async login(): Promise<AuthSession> {
        const xbox = await this.msAuth.launch('electron')
        const mc = await xbox.getMinecraft()
        await this.persist(mc)
        return this.toSession(mc)
    }

    /**
     * Attempts to restore a previous session by refreshing the stored token.
     * Returns null if no token is stored or the refresh fails.
     */
    async restoreSession(): Promise<AuthSession | null> {
        const stored = await this.tokenStore.load()
        if (!stored) return null

        try {
            const TIMEOUT_MS = 10_000
            const mc = await Promise.race([
                Auth.refresh(stored.msmcToken),
                new Promise<never>((_, reject) =>
                    setTimeout(() => reject(new Error('Token refresh timed out')), TIMEOUT_MS),
                ),
            ])
            await this.persist(mc)
            return this.toSession(mc)
        } catch (err) {
            console.warn('[MicrosoftAuthService] Token refresh failed, clearing stored token:', err)
            await this.tokenStore.clear()
            return null
        }
    }


    /**
     * Clears the stored token and ends the current session.
     */
    async logout(): Promise<void> {
        await this.tokenStore.clear()
    }

    // ---------------------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------------------

    private async persist(mc: Minecraft): Promise<void> {
        const persisted: PersistedToken = {
            msmcToken: mc.save(),
            savedAt: new Date().toISOString(),
        }
        await this.tokenStore.save(persisted)
    }

    private toSession(mc: Minecraft): AuthSession {
        return {
            provider: 'microsoft',
            accessToken: mc.access_token,
            profile: {
                id: mc.profile.id,
                name: mc.profile.name,
            },
            createdAt: new Date().toISOString(),
        }
    }
}
