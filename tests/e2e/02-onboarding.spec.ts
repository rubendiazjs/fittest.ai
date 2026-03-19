import { test, expect } from '@playwright/test'
import { OnboardingPage, HAPPY_PATH_ANSWERS } from './pages/onboarding.page'
import { mockSupabaseAuth } from './fixtures/mock-auth'

// Uses storageState from auth setup (authenticated user) —
// we mock the profile GET to return empty so onboarding triggers.

test.describe('Onboarding — wizard flow', () => {
  let onboarding: OnboardingPage

  test.beforeEach(async ({ page }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

    // Prevent expired storageState tokens from triggering a real token refresh
    // that can delay INITIAL_SESSION and keep isLoading=true indefinitely.
    await mockSupabaseAuth(page, supabaseUrl)

    // Mock the `profiles` table used by AuthProvider.fetchUserRole().
    // Without this, auth loading (isLoading=true) persists until the real Supabase query resolves.
    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route) =>
      route.fulfill({
        status: 200,
        json: [{ role: null }],
      })
    )

    // Mock player_profiles GET → PGRST116 error (no rows → triggers onboarding)
    // The app uses .single() which expects PostgREST to return this error when no rows match
    await page.route(`${supabaseUrl}/rest/v1/player_profiles*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 406,
          json: {
            code: 'PGRST116',
            details: 'The result contains 0 rows',
            hint: null,
            message: 'JSON object requested, multiple (or no) rows returned',
          },
        })
      }
      if (request.method() === 'POST' || request.method() === 'PATCH') {
        return route.fulfill({
          status: 201,
          json: [{ id: 'mock-profile-id' }],
        })
      }
      return route.continue()
    })

    // Mock all checkin endpoints — they fire unconditionally (no enabled guard on questions)
    // Without this, checkin queries may hang or return stale data causing loading states
    await page.route(`${supabaseUrl}/rest/v1/checkin_questions*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_responses*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_streaks*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )

    onboarding = new OnboardingPage(page)
    await page.goto('/')

    // Wait for onboarding to load (since profile is mocked empty)
    await onboarding.expectWelcomeScreen()
  })

  test('should display welcome screen with start button', async () => {
    await onboarding.expectWelcomeScreen()
  })

  test('should complete full onboarding happy path (15 questions)', async () => {
    await onboarding.start()
    await expect(onboarding.questionTitle).toBeVisible()

    await onboarding.completeAllQuestions()

    await onboarding.expectResultScreen()
  })

  test('should show progress counter advancing', async () => {
    await onboarding.start()

    await expect(onboarding.questionCounter).toContainText('1 / 15')

    await onboarding.answerQuestion(HAPPY_PATH_ANSWERS[0])

    await expect(onboarding.questionCounter).toContainText('2 / 15')
  })

  test('should allow back navigation to previous question', async () => {
    await onboarding.start()

    const firstTitle = await onboarding.questionTitle.textContent()

    await onboarding.answerQuestion(HAPPY_PATH_ANSWERS[0])
    await expect(onboarding.questionCounter).toContainText('2 / 15')

    await onboarding.backButton.click()

    await expect(onboarding.questionCounter).toContainText('1 / 15')
    await expect(onboarding.questionTitle).toHaveText(firstTitle!)
  })

  test('should show result screen with calculated scores', async () => {
    await onboarding.start()
    await onboarding.completeAllQuestions()
    await onboarding.expectResultScreen()

    await expect(onboarding.page.getByText(/\/10/).first()).toBeVisible()
  })

  test('should save profile and redirect to dashboard', async ({ page }) => {
    await onboarding.start()
    await onboarding.completeAllQuestions()
    await onboarding.expectResultScreen()

    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

    // Remove the beforeEach route that returns PGRST116, then add one that returns profile data.
    // page.route adds handlers in LIFO order — newest handler is checked first.
    // But to be safe, unroute the old pattern first.
    await page.unrouteAll({ behavior: 'ignoreErrors' })

    // Re-mock player_profiles: POST returns success, GET returns profile data
    await page.route(`${supabaseUrl}/rest/v1/player_profiles*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          json: [{
            id: 'mock-profile-id',
            user_id: 'mock-user-id',
            game_experience_level: 'intermediate',
            game_experience_score: 5,
            fitness_level: 'moderate',
            fitness_score: 5,
            years_playing: '6m_2y',
            frequency: 'weekly',
            tournament_level: 'local',
            skills: ['basic_shots', 'lob'],
            activity_level: 'moderate',
            endurance: 'fair',
            injury_status: 'none',
            primary_goal: 'endurance',
            motivation: 'improvement',
            weekly_hours: 'light',
            preferred_time: 'evening',
            sleep_quality: 'good',
            life_context: 'professional',
          }],
        })
      }
      return route.fulfill({ status: 201, json: [{ id: 'mock-profile-id' }] })
    })

    // Re-mock profiles table (AuthProvider)
    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route) =>
      route.fulfill({ status: 200, json: [{ role: null }] })
    )

    // Re-mock check-in data that dashboard needs
    await page.route(`${supabaseUrl}/rest/v1/checkin_responses*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_questions*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_streaks*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )

    await onboarding.finishOnboarding()

    await expect(page.getByText('Tu Perfil de Jugador')).toBeVisible({ timeout: 10_000 })
  })
})
