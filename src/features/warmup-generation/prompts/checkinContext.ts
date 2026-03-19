/**
 * Check-in Context Builder
 *
 * Transforms daily check-in responses into a context object
 * that can be used to personalize warm-up generation.
 */

export interface CheckinContext {
  /** Energy level 1-10 */
  energy_level?: number
  /** Sleep quality: good, average, poor */
  sleep_quality?: string
  /** Body zones with pain/discomfort */
  pain_zones?: string[]
  /** Muscle groups that are sore */
  sore_muscles?: string[]
  /** Stress level 1-10 */
  stress_level?: number
  /** Recovery status: good, moderate, poor */
  recovery_status?: string
  /** Playing frequency this week */
  playing_frequency?: string
  /** Shots the player is working on improving */
  weak_shots?: string[]
  /** Shots the player feels confident with */
  confident_shots?: string[]
}

export interface CheckinResponseWithQuestion {
  id: string
  question_id: string
  response_value: unknown
  skipped: boolean
  response_date: string
  question_slug: string
}

/**
 * Transform an array of check-in responses into a CheckinContext object.
 *
 * Only processes responses where:
 * - skipped is false
 * - question has 'warmup' in ai_relevance
 */
export function buildCheckinContext(
  responses: CheckinResponseWithQuestion[]
): CheckinContext {
  const context: CheckinContext = {}

  for (const response of responses) {
    if (response.skipped) continue

    const slug = response.question_slug
    const value = response.response_value

    switch (slug) {
      case 'energy_level':
        context.energy_level = value as number
        break
      case 'sleep_quality_last_night':
        context.sleep_quality = value as string
        break
      case 'pain_location':
        context.pain_zones = value as string[]
        break
      case 'muscle_soreness':
        context.sore_muscles = value as string[]
        break
      case 'stress_level':
        context.stress_level = value as number
        break
      case 'recovery_feeling':
        context.recovery_status = value as string
        break
      case 'playing_frequency_this_week':
        context.playing_frequency = value as string
        break
      case 'weak_shots':
        context.weak_shots = value as string[]
        break
      case 'confident_shots':
        context.confident_shots = value as string[]
        break
    }
  }

  return context
}

/**
 * Derive fatigue level from check-in context.
 *
 * Logic:
 * - Energy < 5 or poor sleep/recovery → 'tired'
 * - Energy >= 8 → 'fresh'
 * - Otherwise → default
 */
export function deriveFatigueLevel(
  checkin: CheckinContext,
  defaultLevel: 'fresh' | 'normal' | 'tired' = 'normal'
): 'fresh' | 'normal' | 'tired' {
  // Low energy = tired
  if (checkin.energy_level !== undefined && checkin.energy_level < 5) {
    return 'tired'
  }

  // High energy = fresh
  if (checkin.energy_level !== undefined && checkin.energy_level >= 8) {
    return 'fresh'
  }

  // Poor sleep = tired
  if (checkin.sleep_quality === 'poor' || checkin.sleep_quality === 'muy_mal') {
    return 'tired'
  }

  // Poor recovery = tired
  if (checkin.recovery_status === 'poor' || checkin.recovery_status === 'mal') {
    return 'tired'
  }

  return defaultLevel
}

/**
 * Check if check-in context indicates the user needs a gentler warm-up.
 */
export function needsGentlerWarmup(checkin: CheckinContext): boolean {
  return (
    deriveFatigueLevel(checkin) === 'tired' ||
    (checkin.pain_zones?.length ?? 0) > 0 ||
    (checkin.stress_level !== undefined && checkin.stress_level >= 7)
  )
}
