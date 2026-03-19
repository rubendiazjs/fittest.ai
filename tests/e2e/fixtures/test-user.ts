import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { config } from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Load .env.test explicitly from project root
config({ path: path.resolve(__dirname, '../../.env.test') })

/**
 * Test user credentials — loaded from .env.test
 *
 * The .env.test file must contain E2E_TEST_EMAIL and E2E_TEST_PASSWORD.
 * This user must already exist in Supabase with a confirmed email and
 * a completed player profile.
 */
export const TEST_USER = {
  email: process.env.E2E_TEST_EMAIL ?? '',
  password: process.env.E2E_TEST_PASSWORD ?? '',
} as const

if (!TEST_USER.email || !TEST_USER.password) {
  throw new Error(
    'E2E_TEST_EMAIL and E2E_TEST_PASSWORD must be set in .env.test'
  )
}
