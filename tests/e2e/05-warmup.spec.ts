import { test, expect } from '@playwright/test'
import { DashboardPage } from './pages/dashboard.page'
import { WarmupPage } from './pages/warmup.page'
import warmupFixture from './fixtures/warmup-response.json' with { type: 'json' }
import { mockSupabaseAuth } from './fixtures/mock-auth'

// Uses storageState from auth setup (authenticated user with profile)

test.describe('Warmup — generation & guided view', () => {
  let dashboard: DashboardPage
  let warmup: WarmupPage

  test.beforeEach(async ({ page }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

    // Prevent expired storageState tokens from triggering a real token refresh
    // that can delay INITIAL_SESSION and keep isLoading=true indefinitely.
    await mockSupabaseAuth(page, supabaseUrl)

    // Mock profiles table (AuthProvider role fetch) — prevents a real Supabase query
    // that can be slow and keep isLoading=true longer than needed.
    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route) =>
      route.fulfill({ status: 200, json: [{ role: null }] })
    )

    // Mock player_profiles GET to return a deterministic profile — makes the dashboard
    // load immediately without relying on a real Supabase round-trip.
    await page.route(`${supabaseUrl}/rest/v1/player_profiles*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          json: [{
            id: 'e2e-mock-profile-id',
            user_id: 'e2e-mock-user-id',
            game_experience_level: 'intermediate',
            game_experience_score: 6,
            fitness_level: 'good',
            fitness_score: 7,
            years_playing: '2y_5y',
            frequency: 'frequent',
            tournament_level: 'local',
            skills: ['basic_shots', 'lob', 'volley'],
            activity_level: 'moderate',
            endurance: 'good',
            injury_status: 'none',
            primary_goal: 'peak_performance',
            motivation: 'competition',
            weekly_hours: 'moderate',
            preferred_time: 'morning',
            sleep_quality: 'good',
            life_context: 'professional',
          }],
        })
      }
      return route.continue()
    })

    // Prevent the check-in modal from blocking warmup tests.
    // Mock ALL checkin_responses GET requests — today's entry → hasCheckedInToday = true → modal never renders.
    // Also intercept recent-responses queries to avoid slow real Supabase calls.
    const today = new Date().toISOString().split('T')[0]
    const mockTodayEntry = [{
      id: 'e2e-mock-checkin-today',
      question_id: 'mock-question',
      response_value: 7,
      response_date: today,
      responded_at: new Date().toISOString(),
      skipped: false,
    }]
    await page.route(`${supabaseUrl}/rest/v1/checkin_responses*`, (route, request) => {
      if (request.method() === 'GET') {
        const url = request.url()
        // History query joins checkin_questions — return empty array to avoid map errors
        if (url.includes('checkin_questions')) {
          return route.fulfill({ status: 200, json: [] })
        }
        return route.fulfill({ status: 200, json: mockTodayEntry })
      }
      return route.continue()
    })

    // Mock checkin_questions and checkin_streaks to avoid slow real queries
    await page.route(`${supabaseUrl}/rest/v1/checkin_questions*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_streaks*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )

    // Mock the Edge Function for warmup generation — must be set up BEFORE navigation
    await page.route('**/functions/v1/generate-warmup', (route) =>
      route.fulfill({
        status: 200,
        json: warmupFixture,
      })
    )

    dashboard = new DashboardPage(page)
    warmup = new WarmupPage(page)

    await page.goto('/')
    await dashboard.expectLoaded()
  })

  test('should generate warmup and display overview', async ({ page }) => {
    await dashboard.warmupButton.click()

    await expect(page.getByText('Calentamiento Pre-Partido')).toBeVisible({ timeout: 10_000 })
    await warmup.expectOverviewVisible()
  })

  test('should show loading state while generating', async ({ page }) => {
    // Override the mock with a delayed response
    await page.route('**/functions/v1/generate-warmup', async (route) => {
      await new Promise((r) => setTimeout(r, 1_000))
      await route.fulfill({ status: 200, json: warmupFixture })
    })

    await dashboard.warmupButton.click()

    // Should show some loading indicator
    await expect(page.locator('.animate-spin').first()).toBeVisible({ timeout: 3_000 })
  })

  test('should display RAMP phases and drills', async ({ page }) => {
    await dashboard.warmupButton.click()
    await warmup.expectOverviewVisible()

    await expect(page.getByText('Elevar').first()).toBeVisible()
    await expect(page.getByText('Activar').first()).toBeVisible()
    await expect(page.getByText('Trote suave con movilidad de hombros')).toBeVisible()
    await expect(page.getByText('Sentadilla con rotación de tronco')).toBeVisible()
  })

  test('should start guided warmup view', async () => {
    await dashboard.warmupButton.click()
    await warmup.expectOverviewVisible()

    await warmup.startGuided()

    await expect(warmup.exitButton).toBeVisible()
  })

  test('should navigate through guided drills', async ({ page }) => {
    await dashboard.warmupButton.click()
    await warmup.expectOverviewVisible()

    await warmup.startGuided()

    await expect(page.getByText('Trote suave con movilidad de hombros')).toBeVisible()

    await warmup.navigateAllDrills()
  })

  test('should show completion screen after all drills', async () => {
    await dashboard.warmupButton.click()
    await warmup.expectOverviewVisible()

    await warmup.startGuided()
    await warmup.navigateAllDrills()
    await warmup.finish()

    await warmup.expectCompletionScreen()
  })

  test('should exit guided view back to overview', async () => {
    await dashboard.warmupButton.click()
    await warmup.expectOverviewVisible()

    await warmup.startGuided()
    await expect(warmup.exitButton).toBeVisible()

    await warmup.exitGuided()

    await warmup.expectOverviewVisible()
  })
})
