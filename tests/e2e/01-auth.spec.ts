import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/login.page'
import { TEST_USER } from './fixtures/test-user'

// Auth tests run WITHOUT storageState — unauthenticated user
test.use({ storageState: { cookies: [], origins: [] } })

test.describe('Auth — login & registration', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.goto()
  })

  test('should display sign-in form for unauthenticated visitor', async () => {
    await loginPage.expectSignInFormVisible()
  })

  test('should toggle between sign-in and sign-up modes', async () => {
    await loginPage.switchToSignUp()
    await expect(loginPage.page.getByText('Crear cuenta')).toBeVisible()
    await expect(loginPage.registerButton).toBeVisible()

    await loginPage.switchToSignIn()
    await expect(loginPage.signInButton).toBeVisible()
  })

  test('should show validation error for empty email', async () => {
    // Submit without filling anything
    await loginPage.signInButton.click()

    await expect(loginPage.validationError('El email es obligatorio')).toBeVisible()
  })

  test('should show validation error for short password on sign-up', async () => {
    await loginPage.switchToSignUp()
    await loginPage.emailInput.fill('test@example.com')
    await loginPage.passwordInput.fill('short')
    await loginPage.registerButton.click()

    await expect(
      loginPage.validationError('La contraseña debe tener al menos 8 caracteres')
    ).toBeVisible()
  })

  test('should show error for wrong credentials', async ({ page }) => {
    await loginPage.signIn('nonexistent@example.com', 'wrongpassword123')

    // Supabase returns an error message
    await expect(page.getByText(/Invalid login credentials|error/i)).toBeVisible({
      timeout: 10_000,
    })
  })

  test('should sign in successfully with valid credentials', async ({ page }) => {
    await loginPage.signIn(TEST_USER.email, TEST_USER.password)

    // Should redirect to dashboard
    await expect(page.getByText('Tu Perfil de Jugador')).toBeVisible({ timeout: 15_000 })
  })

  test('should show email confirmation page after sign-up', async ({ page }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

    // Mock the sign-up endpoint to return a fake "confirm email" response
    await page.route(`${supabaseUrl}/auth/v1/signup`, (route) =>
      route.fulfill({
        status: 200,
        json: {
          id: 'fake-signup-user-id',
          email: 'e2e-signup@example.com',
          confirmation_sent_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          identities: [],
        },
      })
    )

    await loginPage.signUp('e2e-signup@example.com', 'testPassword123!')

    // Should show the confirmation message
    await expect(page.getByText('Revisa tu email')).toBeVisible({ timeout: 10_000 })
  })
})
