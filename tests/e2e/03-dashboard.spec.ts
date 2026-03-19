import { test, expect } from '@playwright/test'
import { DashboardPage } from './pages/dashboard.page'
import { LoginPage } from './pages/login.page'
import { mockSupabaseAuth } from './fixtures/mock-auth'

// Uses storageState from auth setup (authenticated user with profile)

test.describe('Dashboard — profile overview', () => {
  let dashboard: DashboardPage

  test.beforeEach(async ({ page }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

    // Prevent expired storageState tokens from triggering a real token refresh
    // that can delay INITIAL_SESSION and keep isLoading=true indefinitely.
    await mockSupabaseAuth(page, supabaseUrl)

    // Mock profiles table (AuthProvider role fetch) — prevents a real Supabase query
    // that can be slow and keep isLoading=true longer than needed.
    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route) =>
      route.fulfill({ status: 200, json: [{ role: 'athlete' }] })
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

    // Prevent the check-in modal from blocking dashboard tests.
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

    dashboard = new DashboardPage(page)
    await dashboard.goto()
    await dashboard.expectLoaded()
  })

  test('should display profile summary cards', async () => {
    await dashboard.expectProfileCards()
  })

  test('should display profile details section', async () => {
    await dashboard.expectProfileDetails()
  })

  test('should display warmup CTA card', async () => {
    await dashboard.expectWarmupCTA()
  })

  test('should show streak indicator', async () => {
    await expect(dashboard.streakIndicator).toBeVisible()
  })

  test('should open check-in history when clicking streak', async ({ page }) => {
    await dashboard.clickStreak()
    // History modal should appear with some kind of history view
    await expect(page.getByRole('heading', { name: 'Historial reciente' })).toBeVisible({ timeout: 5_000 })
  })

  test('should log out successfully', async ({ page }) => {
    await dashboard.logout()

    // Should redirect to login page
    const loginPage = new LoginPage(page)
    await loginPage.expectSignInFormVisible()
  })
})
