import { type Page, type Locator, expect } from '@playwright/test'

/**
 * Happy-path answers for the 15 onboarding questions.
 * Index matches QUESTIONS array order in questions.ts.
 *
 * For single-select: { label } — clicks the option, auto-advances after 300ms
 * For multi-select:  { labels } — clicks each option, then "Continuar"
 */
export const HAPPY_PATH_ANSWERS: Array<
  { type: 'single'; label: string } | { type: 'multi'; labels: string[] }
> = [
  // Q1  yearsPlaying (single)
  { type: 'single', label: '6 meses - 2 años' },
  // Q2  frequency (single)
  { type: 'single', label: 'Semanal' },
  // Q3  selfAssessedLevel (single)
  { type: 'single', label: 'Intermedio' },
  // Q4  tournamentLevel (single)
  { type: 'single', label: 'Torneos locales' },
  // Q5  skills (multi)
  { type: 'multi', labels: ['Derecha y revés de fondo', 'Globo'] },
  // Q6  activityLevel (single)
  { type: 'single', label: 'Moderado' },
  // Q7  additionalTraining (multi)
  { type: 'multi', labels: ['Gimnasio / Fuerza'] },
  // Q8  endurance (single)
  { type: 'single', label: 'Aguanto el partido' },
  // Q9  injuryStatus (single)
  { type: 'single', label: 'Ninguna' },
  // Q10 primaryGoal (single)
  { type: 'single', label: 'Mejorar resistencia' },
  // Q11 motivation (single)
  { type: 'single', label: 'Mejorar' },
  // Q12 weeklyHours (single)
  { type: 'single', label: '1-2 horas' },
  // Q13 preferredTime (single)
  { type: 'single', label: 'Tardes' },
  // Q14 sleepQuality (single)
  { type: 'single', label: 'Bueno' },
  // Q15 lifeContext (single)
  { type: 'single', label: 'Profesional' },
]

export class OnboardingPage {
  readonly page: Page
  readonly startButton: Locator
  readonly continueButton: Locator
  readonly finishButton: Locator
  readonly questionTitle: Locator
  readonly questionCounter: Locator
  readonly backButton: Locator

  constructor(page: Page) {
    this.page = page
    this.startButton = page.getByRole('button', { name: 'Empezar' })
    this.continueButton = page.getByRole('button', { name: 'Continuar' })
    this.finishButton = page.getByRole('button', { name: 'Empezar a entrenar' })
    this.questionTitle = page.locator('h1')
    this.questionCounter = page.locator('.fixed.top-4.left-4')
    this.backButton = page.locator('button:has(svg.lucide-chevron-up)')
  }

  async expectWelcomeScreen() {
    await expect(this.page.getByText('Fittest.ai')).toBeVisible({ timeout: 30_000 })
    await expect(this.startButton).toBeVisible()
  }

  async start() {
    await this.startButton.click()
  }

  /** Answer a single question (single or multi select) */
  async answerQuestion(answer: typeof HAPPY_PATH_ANSWERS[number]) {
    if (answer.type === 'single') {
      await this.page.getByText(answer.label, { exact: true }).click()
      // Wait for auto-advance animation (300ms)
      await this.page.waitForTimeout(500)
    } else {
      for (const label of answer.labels) {
        await this.page.getByText(label, { exact: true }).click()
      }
      await this.continueButton.click()
    }
  }

  /** Complete the full 15-question happy path */
  async completeAllQuestions() {
    for (const answer of HAPPY_PATH_ANSWERS) {
      await this.answerQuestion(answer)
    }
  }

  async expectResultScreen() {
    await expect(this.page.getByText('Tu Perfil de Jugador')).toBeVisible()
    await expect(this.page.getByText('Experiencia de Juego')).toBeVisible()
    await expect(this.page.getByText('Nivel Físico')).toBeVisible()
  }

  async finishOnboarding() {
    await this.finishButton.click()
  }
}
