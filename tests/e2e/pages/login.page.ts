import { type Page, type Locator, expect } from '@playwright/test'

export class LoginPage {
  readonly page: Page
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly signInButton: Locator
  readonly signUpToggle: Locator
  readonly signInToggle: Locator
  readonly registerButton: Locator

  constructor(page: Page) {
    this.page = page
    this.emailInput = page.getByLabel('Email')
    this.passwordInput = page.getByLabel('Contraseña')
    this.signInButton = page.getByRole('button', { name: 'Iniciar sesión' })
    this.signUpToggle = page.getByRole('button', { name: 'Regístrate' })
    this.signInToggle = page.getByRole('button', { name: 'Inicia sesión' })
    this.registerButton = page.getByRole('button', { name: 'Registrarse' })
  }

  async goto() {
    await this.page.goto('/')
  }

  async signIn(email: string, password: string) {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.signInButton.click()
  }

  async switchToSignUp() {
    await this.signUpToggle.click()
  }

  async switchToSignIn() {
    await this.signInToggle.click()
  }

  async signUp(email: string, password: string) {
    await this.switchToSignUp()
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.registerButton.click()
  }

  validationError(text: string) {
    return this.page.getByText(text)
  }

  async expectSignInFormVisible() {
    await expect(this.emailInput).toBeVisible()
    await expect(this.passwordInput).toBeVisible()
    await expect(this.signInButton).toBeVisible()
  }
}
