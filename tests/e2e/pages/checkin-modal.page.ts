import { type Page, type Locator, expect } from '@playwright/test'

export class CheckinModalPage {
  readonly page: Page
  readonly closeButton: Locator
  readonly submitButton: Locator
  readonly skipButton: Locator
  readonly questionTitle: Locator

  constructor(page: Page) {
    this.page = page
    this.closeButton = page.getByLabel('Cerrar')
    this.submitButton = page.getByRole('button', { name: 'Responder' })
    this.skipButton = page.getByRole('button', { name: 'Saltar por hoy' })
    this.questionTitle = page.locator('h2')
  }

  async expectVisible() {
    await expect(this.questionTitle).toBeVisible()
    await expect(this.submitButton).toBeVisible()
  }

  async skip() {
    await this.skipButton.click()
  }

  async close() {
    await this.closeButton.click()
  }

  /**
   * Interact with whatever input type the check-in question renders.
   *
   * SliderInput: renders numbered <button>s (1-10) — click "7"
   * SingleSelect: renders option <button>s — click the first one
   * MultiSelect / body_map: renders labeled <button>s — click the first one
   * YesNo: renders "Sí" / "No" buttons — click "Sí"
   * Text: renders <textarea> — fill with "Bien"
   */
  async provideAnswer() {
    // SliderInput renders numbered buttons 1-10 in a row.
    // Detect by looking for a button labeled exactly "7".
    const sliderBtn = this.page.getByRole('button', { name: '7', exact: true })
    if (await sliderBtn.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await sliderBtn.click()
      return
    }

    // YesNo input — click "Sí"
    const yesBtn = this.page.getByRole('button', { name: 'Sí', exact: true })
    if (await yesBtn.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await yesBtn.click()
      return
    }

    // Text input (textarea)
    const textInput = this.page.locator('textarea, input[type="text"]')
    if (await textInput.isVisible({ timeout: 1_000 }).catch(() => false)) {
      await textInput.fill('Bien')
      return
    }

    // Single-select or multi-select / body_map: any button that is NOT a modal action.
    // Modal action buttons are: "Responder", "Saltar por hoy", "Cerrar"
    const optionButtons = this.page.locator('button').filter({
      hasNotText: /^(Responder|Saltar por hoy|Cerrar|Sí|No)$/,
    })
    const count = await optionButtons.count()
    if (count > 0) {
      await optionButtons.first().click()
      return
    }
  }

  async submit() {
    await this.submitButton.click()
  }
}
