import { test, expect } from '@playwright/test'
import { CheckinModalPage } from './pages/checkin-modal.page'
import { mockSupabaseAuth } from './fixtures/mock-auth'

// Uses storageState from auth setup (authenticated user with profile)

test.describe('Daily Check-in — modal interactions', () => {
  test.describe('when no check-in exists today', () => {
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

      // Mock checkin_questions to return a deterministic slider question.
      // Without this mock, the real query may be slow and keep checkin.isLoading=true,
      // which prevents showCheckinModal from ever becoming true.
      await page.route(`${supabaseUrl}/rest/v1/checkin_questions*`, (route) =>
        route.fulfill({
          status: 200,
          json: [{
            id: 'e2e-question-energy',
            slug: 'energy_level',
            category: 'physical_state',
            subcategory: 'energy',
            input_type: 'slider',
            title_es: '¿Cómo está tu nivel de energía hoy?',
            subtitle_es: 'Del 1 (sin energía) al 10 (lleno de energía)',
            options: null,
            config: { min: 1, max: 10, labels: { '1': 'Sin energía', '5': 'Normal', '10': 'Lleno de energía' } },
            priority: 90,
            cooldown_days: 1,
            trigger_conditions: null,
            ai_relevance: ['energy', 'performance'],
          }],
        })
      )

      // Mock all checkin_responses requests with stateful behaviour:
      // - GET: initially returns empty (no check-in today); after POST returns the submitted entry
      // - POST: records the submission and returns success
      // Stateful flag: tracks whether user has submitted today so re-fetches see the new row.
      const today = new Date().toISOString().split('T')[0]
      let hasSubmittedToday = false
      await page.route(`${supabaseUrl}/rest/v1/checkin_responses*`, (route, request) => {
        if (request.method() === 'POST') {
          hasSubmittedToday = true
          return route.fulfill({
            status: 201,
            json: [{ id: 'e2e-checkin-response-001' }],
          })
        }
        // GET requests: after submission return today's entry so hasCheckedInToday becomes true
        if (hasSubmittedToday) {
          return route.fulfill({
            status: 200,
            json: [{
              id: 'e2e-checkin-response-001',
              question_id: 'e2e-question-energy',
              response_value: 7,
              response_date: today,
              responded_at: new Date().toISOString(),
              skipped: false,
            }],
          })
        }
        // GET requests before any submission: return empty (no check-in today)
        return route.fulfill({ status: 200, json: [] })
      })

      // Mock checkin_streaks to avoid slow real queries
      await page.route(`${supabaseUrl}/rest/v1/checkin_streaks*`, (route) =>
        route.fulfill({ status: 200, json: [] })
      )

      await page.goto('/')

      // Wait for dashboard to be ready (behind the modal)
      await expect(page.getByText('Tu Perfil de Jugador')).toBeVisible({ timeout: 15_000 })
    })

    test('should show check-in modal when no check-in exists today', async ({ page }) => {
      const checkinModal = new CheckinModalPage(page)
      await checkinModal.expectVisible()
    })

    test('should allow skipping the check-in', async ({ page }) => {
      const checkinModal = new CheckinModalPage(page)
      await checkinModal.expectVisible()

      await checkinModal.skip()

      // Modal should close — check that submit button is gone
      await expect(checkinModal.submitButton).not.toBeVisible()
    })

    test('should allow closing the modal with X button', async ({ page }) => {
      const checkinModal = new CheckinModalPage(page)
      await checkinModal.expectVisible()

      await checkinModal.close()

      // Modal should close
      await expect(checkinModal.submitButton).not.toBeVisible()
    })

    test('should submit a check-in response', async ({ page }) => {
      const checkinModal = new CheckinModalPage(page)
      await checkinModal.expectVisible()

      await checkinModal.provideAnswer()
      await checkinModal.submit()

      // Modal should close after submission
      await expect(checkinModal.submitButton).not.toBeVisible({ timeout: 10_000 })
    })
  })

  test('should not show modal when already checked in today', async ({ page }) => {
    const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

    await mockSupabaseAuth(page, supabaseUrl)

    // Mock profiles table (AuthProvider role fetch)
    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route) =>
      route.fulfill({ status: 200, json: [{ role: 'athlete' }] })
    )

    // Mock player_profiles GET to return a deterministic profile
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

    // Mock checkin_questions and checkin_streaks to avoid slow real queries
    await page.route(`${supabaseUrl}/rest/v1/checkin_questions*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_streaks*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )

    // Mock checkin_responses to return a today entry → hasCheckedInToday = true → modal never renders
    const today = new Date().toISOString().split('T')[0]
    await page.route(`${supabaseUrl}/rest/v1/checkin_responses*`, (route, request) => {
      const url = request.url()
      if (request.method() === 'GET' && url.includes(`response_date=eq.${today}`)) {
        return route.fulfill({
          status: 200,
          json: [{
            id: 'e2e-mock-checkin-today',
            question_id: 'mock-question',
            response_value: 7,
            response_date: today,
            responded_at: new Date().toISOString(),
            skipped: false,
          }],
        })
      }
      return route.continue()
    })

    await page.goto('/')

    // Wait for dashboard to load
    await expect(page.getByText('Tu Perfil de Jugador')).toBeVisible({ timeout: 15_000 })

    // The check-in modal submit button should NOT be visible
    await expect(page.getByRole('button', { name: 'Responder' })).not.toBeVisible()
  })
})
