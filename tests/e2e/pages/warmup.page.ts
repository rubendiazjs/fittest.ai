import { type Page, type Locator, expect } from '@playwright/test'

export class WarmupPage {
  readonly page: Page
  readonly startGuidedButton: Locator
  readonly nextButton: Locator
  readonly finishButton: Locator
  readonly exitButton: Locator
  readonly completionTitle: Locator
  readonly playButton: Locator

  constructor(page: Page) {
    this.page = page
    this.startGuidedButton = page.getByRole('button', { name: 'Comenzar calentamiento guiado' })
    this.nextButton = page.getByRole('button', { name: 'Siguiente' })
    this.finishButton = page.getByRole('button', { name: 'Finalizar' })
    this.exitButton = page.getByRole('button', { name: 'Salir' })
    this.completionTitle = page.getByText('Calentamiento Completado')
    this.playButton = page.getByRole('button', { name: '¡A jugar!' })
  }

  async expectOverviewVisible() {
    await expect(this.startGuidedButton).toBeVisible()
  }

  async startGuided() {
    await this.startGuidedButton.click()
  }

  /**
   * Complete the current drill's rounds by clicking the round tracker buttons.
   * RoundTracker renders a button per round with the round number (e.g., "1").
   * The current round button has border-primary styling and is enabled.
   */
  private async completeCurrentDrillRounds() {
    // Look for the "Serie" or "Series" label to confirm we're in the round tracker
    const serieText = this.page.getByText(/^Series?$/)
    if (await serieText.isVisible({ timeout: 1_000 }).catch(() => false)) {
      // Click round buttons that are enabled (current round)
      // The round button shows the round number and is a large 56x56 button
      const roundButtons = this.page.locator('button.w-14.h-14')
      const count = await roundButtons.count()
      for (let i = 0; i < count; i++) {
        const btn = roundButtons.nth(i)
        if (await btn.isEnabled()) {
          await btn.click()
          // Wait for round completion animation
          await this.page.waitForTimeout(300)
        }
      }
    }
  }

  /**
   * Navigate through all drills in the guided warmup.
   * For each drill: complete rounds → click "Siguiente" (or "Finalizar" for last drill).
   */
  async navigateAllDrills() {
    const maxIterations = 20
    for (let i = 0; i < maxIterations; i++) {
      // Check if we've reached the finish button (last drill, all rounds complete)
      if (await this.finishButton.isVisible({ timeout: 500 }).catch(() => false)) {
        return
      }

      // Try to complete the current drill's rounds
      await this.completeCurrentDrillRounds()

      // After completing rounds, "Siguiente" or "Finalizar" should appear
      if (await this.finishButton.isVisible({ timeout: 500 }).catch(() => false)) {
        return
      }

      if (await this.nextButton.isVisible({ timeout: 500 }).catch(() => false)) {
        await this.nextButton.click()
        await this.page.waitForTimeout(300)
        continue
      }

      // Fallback: try "Saltar ejercicio" (skip) if rounds weren't completed
      const skipBtn = this.page.getByRole('button', { name: 'Saltar ejercicio' })
      if (await skipBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await skipBtn.click()
        await this.page.waitForTimeout(300)
        continue
      }

      // Wait for UI transition
      await this.page.waitForTimeout(500)
    }
  }

  async finish() {
    await this.finishButton.click()
  }

  async expectCompletionScreen() {
    await expect(this.completionTitle).toBeVisible()
  }

  async exitGuided() {
    await this.exitButton.click()
  }
}
