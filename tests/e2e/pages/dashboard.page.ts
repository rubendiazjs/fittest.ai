import { type Page, type Locator, expect } from '@playwright/test'

export class DashboardPage {
  readonly page: Page
  readonly profileTitle: Locator
  readonly warmupButton: Locator
  readonly logoutButton: Locator
  readonly streakIndicator: Locator
  readonly updateProfileButton: Locator

  constructor(page: Page) {
    this.page = page
    this.profileTitle = page.getByText('Tu Perfil de Jugador')
    this.warmupButton = page.getByRole('button', { name: 'Generar Calentamiento Pre-Partido' })
    this.logoutButton = page.getByRole('button', { name: 'Cerrar sesión' })
    this.updateProfileButton = page.getByRole('button', { name: 'Actualizar Perfil' })
    this.streakIndicator = page.locator('.fixed.top-4.right-4')
  }

  async goto() {
    await this.page.goto('/')
  }

  async expectLoaded() {
    await expect(this.profileTitle).toBeVisible({ timeout: 30_000 })
  }

  async expectProfileCards() {
    await expect(this.page.getByText('Experiencia de Juego')).toBeVisible()
    await expect(this.page.getByText('Nivel Físico')).toBeVisible()
  }

  async expectProfileDetails() {
    await expect(this.page.getByText('Años jugando')).toBeVisible()
  }

  async expectWarmupCTA() {
    await expect(this.warmupButton).toBeVisible()
  }

  async clickStreak() {
    await this.streakIndicator.click()
  }

  async logout() {
    await this.logoutButton.click()
  }
}
