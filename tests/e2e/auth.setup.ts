import { test as setup, expect } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { TEST_USER } from './fixtures/test-user'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(__dirname, '..', '..', '.auth', 'user.json')

setup('authenticate', async ({ page }) => {
  await page.goto('/')

  // Fill login form
  await page.getByLabel('Email').fill(TEST_USER.email)
  await page.getByLabel('Contraseña').fill(TEST_USER.password)
  await page.getByRole('button', { name: 'Iniciar sesión' }).click()

  // Wait for dashboard to load (user has a profile)
  await expect(page.getByText('Tu Perfil de Jugador')).toBeVisible({ timeout: 15_000 })

  // Save auth state for reuse
  await page.context().storageState({ path: authFile })
})
