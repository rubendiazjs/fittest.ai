import type { Page } from '@playwright/test'

/**
 * Builds a fake JWT with a future expiry.
 *
 * Supabase JS decodes the JWT payload client-side only to read `exp` — it does
 * NOT verify the signature in the browser. A structurally valid base64url JWT
 * with a correct payload is sufficient to pass the client-side session check.
 */
function buildFakeJWT(expiresAt: number): string {
  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url')

  const now = Math.floor(Date.now() / 1000)
  return [
    encode({ alg: 'HS256', typ: 'JWT' }),
    encode({
      sub: 'e2e-test-user-id',
      aud: 'authenticated',
      role: 'authenticated',
      iat: now,
      exp: expiresAt,
      email: 'e2e@test.com',
      is_anonymous: false,
    }),
    'e2e_fake_sig_not_verified_client_side',
  ].join('.')
}

/**
 * Mocks the Supabase auth token endpoint so the client never makes a real
 * network call to refresh an expired session.
 *
 * Problem: the `.auth/user.json` storageState may contain an expired access
 * token (e.g. from a previous day's test run). When Supabase JS initialises, it
 * detects the expiry and calls `POST /auth/v1/token?grant_type=refresh_token`
 * before firing `INITIAL_SESSION`. If that real request is slow or hangs, the
 * app stays in `isLoading: true` indefinitely, causing `beforeEach` timeouts.
 *
 * Solution: intercept the endpoint and return a structurally valid mock session
 * immediately, so `INITIAL_SESSION` fires without any real network round-trip.
 *
 * Register this BEFORE other route mocks and before `page.goto()`.
 */
export async function mockSupabaseAuth(page: Page, supabaseUrl: string): Promise<void> {
  const expiresAt = Math.floor(Date.now() / 1000) + 3600
  const fakeJWT = buildFakeJWT(expiresAt)

  await page.route(`${supabaseUrl}/auth/v1/token*`, (route) => {
    route.fulfill({
      status: 200,
      json: {
        access_token: fakeJWT,
        token_type: 'bearer',
        expires_in: 3600,
        expires_at: expiresAt,
        refresh_token: 'e2e-fake-refresh-token',
        user: {
          id: 'e2e-test-user-id',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'e2e@test.com',
          email_confirmed_at: new Date().toISOString(),
          phone: '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_anonymous: false,
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: {},
          identities: [],
        },
      },
    })
  })

  // Mock the logout endpoint so signOut() completes instantly without a real
  // server round-trip. The Supabase JS client calls _removeSession() and fires
  // SIGNED_OUT after receiving a successful response, regardless of whether the
  // server actually revoked the session.
  await page.route(`${supabaseUrl}/auth/v1/logout*`, (route) => {
    route.fulfill({ status: 204, body: '' })
  })
}
