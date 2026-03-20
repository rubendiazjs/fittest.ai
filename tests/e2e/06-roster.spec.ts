import { test, expect } from '@playwright/test'
import { mockSupabaseAuth } from './fixtures/mock-auth'

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ?? 'https://qhtkechgkkkigxxweahc.supabase.co'

test.describe('Roster — coach invite and athlete acceptance', () => {
  test('coach can create a pending invite and see it in the roster panel', async ({ page }) => {
    let inviteCreated = false
    const createdAt = new Date().toISOString()

    await mockSupabaseAuth(page, supabaseUrl)

    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route, request) => {
      const url = request.url()

      if (url.includes('select=role')) {
        return route.fulfill({ status: 200, json: { role: 'coach' } })
      }

      if (url.includes('role=eq.athlete')) {
        return route.fulfill({
          status: 200,
          json: [
            { id: 'athlete-1', full_name: 'Lucia Ramos' },
            { id: 'athlete-2', full_name: 'Pablo Diaz' },
          ],
        })
      }

      if (url.includes('id=in.(')) {
        return route.fulfill({
          status: 200,
          json: [{ id: 'athlete-1', full_name: 'Lucia Ramos' }],
        })
      }

      return route.fulfill({ status: 200, json: [] })
    })

    await page.route(`${supabaseUrl}/rest/v1/coach_profiles*`, (route, request) => {
      const url = request.url()

      if (request.method() === 'GET' && url.includes('id=eq.e2e-test-user-id')) {
        return route.fulfill({
          status: 200,
          json: {
            id: 'e2e-test-user-id',
            bio: 'Coach profile',
            certifications: ['NSCA'],
            specialties: ['padel'],
            organization_name: 'Padel Lab',
            is_verified: false,
            created_at: createdAt,
            updated_at: createdAt,
          },
        })
      }

      return route.fulfill({ status: 200, json: [] })
    })

    await page.route(`${supabaseUrl}/rest/v1/roster_links*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          json: inviteCreated
            ? [
                {
                  id: 'link-1',
                  coach_id: 'e2e-test-user-id',
                  athlete_id: 'athlete-1',
                  status: 'pending',
                  created_at: createdAt,
                },
              ]
            : [],
        })
      }

      if (request.method() === 'POST') {
        inviteCreated = true
        return route.fulfill({
          status: 201,
          json: { id: 'link-1' },
        })
      }

      return route.continue()
    })

    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Invitar atleta' })).toBeVisible()
    await page.getByRole('button', { name: 'Invitar' }).first().click()

    await expect(page.getByText('Lucia Ramos')).toBeVisible()
    await expect(page.getByText('Pendientes')).toBeVisible()
    await expect(page.getByText('1').first()).toBeVisible()
  })

  test('athlete can accept a pending coach invite from the dashboard', async ({ page }) => {
    let inviteAccepted = false
    const today = new Date().toISOString().split('T')[0]
    const createdAt = new Date().toISOString()

    await mockSupabaseAuth(page, supabaseUrl)

    await page.route(`${supabaseUrl}/rest/v1/profiles*`, (route, request) => {
      const url = request.url()

      if (url.includes('select=role')) {
        return route.fulfill({ status: 200, json: { role: 'athlete' } })
      }

      if (url.includes('id=in.(')) {
        return route.fulfill({
          status: 200,
          json: [{ id: 'coach-1', full_name: 'Coach Sofia' }],
        })
      }

      return route.fulfill({ status: 200, json: [] })
    })

    await page.route(`${supabaseUrl}/rest/v1/player_profiles*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          json: [
            {
              id: 'e2e-player-profile',
              user_id: 'e2e-test-user-id',
              game_experience_level: 'intermediate',
              game_experience_score: 6,
              fitness_level: 'good',
              fitness_score: 7,
              years_playing: '2y_5y',
              frequency: 'frequent',
              tournament_level: 'local',
              skills: ['basic_shots', 'lob'],
              activity_level: 'moderate',
              endurance: 'good',
              injury_status: 'none',
              primary_goal: 'peak_performance',
              motivation: 'competition',
              weekly_hours: 'moderate',
              preferred_time: 'morning',
              sleep_quality: 'good',
              life_context: 'professional',
            },
          ],
        })
      }

      return route.continue()
    })

    await page.route(`${supabaseUrl}/rest/v1/checkin_questions*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_streaks*`, (route) =>
      route.fulfill({ status: 200, json: [] })
    )
    await page.route(`${supabaseUrl}/rest/v1/checkin_responses*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          json: [
            {
              id: 'today-checkin',
              question_id: 'question-1',
              response_value: 8,
              response_date: today,
              responded_at: createdAt,
              skipped: false,
            },
          ],
        })
      }

      return route.continue()
    })

    await page.route(`${supabaseUrl}/rest/v1/coach_profiles*`, (route) =>
      route.fulfill({
        status: 200,
        json: [{ id: 'coach-1', organization_name: 'Padel Lab' }],
      })
    )

    await page.route(`${supabaseUrl}/rest/v1/roster_links*`, (route, request) => {
      if (request.method() === 'GET') {
        return route.fulfill({
          status: 200,
          json: inviteAccepted
            ? []
            : [
                {
                  id: 'invite-1',
                  coach_id: 'coach-1',
                  athlete_id: 'e2e-test-user-id',
                  status: 'pending',
                  created_at: createdAt,
                },
              ],
        })
      }

      if (request.method() === 'PATCH') {
        inviteAccepted = true
        return route.fulfill({
          status: 200,
          json: { id: 'invite-1' },
        })
      }

      return route.continue()
    })

    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: 'Invitaciones de coach pendientes' })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Aceptar invitación' }).click()

    await expect(
      page.getByRole('heading', { name: 'Invitaciones de coach pendientes' })
    ).toHaveCount(0)
  })
})
