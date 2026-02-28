import { test, expect } from '@playwright/test'

/**
 * Smoke test — verifies the home page loads and the auth gate renders
 * correctly for an unauthenticated visitor.
 *
 * App flow for unauthenticated user (from App.tsx):
 *   AuthProvider checks session → no user → renders <LoginPage />
 *
 * LoginPage renders a Card with:
 *   - CardTitle "Iniciar sesión" — rendered as a <div>, NOT an <h1>/<h2>,
 *     so getByRole('heading') does NOT work. Use getByText() instead.
 *   - Email label + input (Label uses @radix-ui/react-label → real <label>)
 *   - Contraseña label + input
 *   - Submit Button (shadcn Button → real <button>) "Iniciar sesión"
 *   - Toggle is a plain <button> element "Regístrate" / "Inicia sesión"
 *
 * Root cause of original failure:
 *   CardTitle in src/components/ui/card.tsx renders a <div>, not a heading
 *   element. getByRole('heading') requires an <h1>-<h6> element.
 *   Fix: use getByText() to locate the title text by its visible content.
 */
test.describe('Smoke — home page', () => {
  test('should load the login page for an unauthenticated visitor', async ({ page }) => {
    await test.step('navigate to the root URL', async () => {
      await page.goto('/')
    })

    await test.step('verify the page title is set', async () => {
      await expect(page).toHaveTitle(/fittest\.ai/i)
    })

    await test.step('verify the sign-in title text is visible', async () => {
      // CardTitle renders a <div>, not an <h*> — use getByText, not getByRole('heading')
      await expect(page.getByText('Iniciar sesión').first()).toBeVisible()
    })

    await test.step('verify the email field is present', async () => {
      // Label uses @radix-ui/react-label which renders a real <label htmlFor="email">
      await expect(page.getByLabel('Email')).toBeVisible()
    })

    await test.step('verify the password field is present', async () => {
      await expect(page.getByLabel('Contraseña')).toBeVisible()
    })

    await test.step('verify the submit button is visible and enabled', async () => {
      // The submit Button is a real <button type="submit">
      // There are two elements with this text (CardTitle div + Button), so be
      // specific about the role to target only the interactive button.
      const submitBtn = page.getByRole('button', { name: 'Iniciar sesión' })
      await expect(submitBtn).toBeVisible()
      await expect(submitBtn).toBeEnabled()
    })
  })

  test('should switch to the sign-up form when the toggle link is clicked', async ({ page }) => {
    await test.step('navigate to the root URL', async () => {
      await page.goto('/')
    })

    await test.step('wait for the login form to be ready', async () => {
      // Anchor on the submit button being visible — it is a real <button> so
      // getByRole works and is unambiguous, unlike the CardTitle <div>
      await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible()
    })

    await test.step('click the "Regístrate" toggle button', async () => {
      // The toggle is a plain <button type="button"> inside a <p>
      await page.getByRole('button', { name: 'Regístrate' }).click()
    })

    await test.step('verify the title text changes to "Crear cuenta"', async () => {
      await expect(page.getByText('Crear cuenta')).toBeVisible()
    })

    await test.step('verify the register submit button appears', async () => {
      await expect(page.getByRole('button', { name: 'Registrarse' })).toBeVisible()
    })
  })
})
