import type {
  OnboardingFormData,
  GameExperienceLevel,
  FitnessLevel,
  PlayerClassification,
} from '../types'

/**
 * Calculates game experience level and score from form data.
 *
 * Algorithm:
 * - Base score from self-assessed level (2-9)
 * - Modifiers for years playing, frequency, tournament level
 * - Skill bonus for advanced skills
 * - Final score clamped to 0-10
 */
export function calculateGameExperience(
  data: OnboardingFormData['gameExperience']
): { level: GameExperienceLevel; score: number } {
  if (!data) return { level: 'beginner', score: 0 }

  // Base score from self-assessed level
  const levelBase: Record<GameExperienceLevel, number> = {
    beginner: 2,
    intermediate: 5,
    advanced: 7,
    pro: 9,
  }

  let score = levelBase[data.selfAssessedLevel || 'beginner']

  // Modifiers based on experience indicators
  if (data.yearsPlaying === '2y_5y') score += 0.5
  if (data.yearsPlaying === 'more_5y') score += 1

  if (data.frequency === 'frequent') score += 0.5
  if (data.frequency === 'daily') score += 1

  if (data.tournamentLevel === 'federated') score += 0.5
  if (data.tournamentLevel === 'professional') score += 1

  // Bonus for advanced skills (max 0.5)
  const advancedSkills = ['lobs_bandejas', 'wall_rebounds', 'smash', 'positioning']
  const skillBonus = (data.skills || []).filter(s => advancedSkills.includes(s)).length * 0.1
  score += Math.min(skillBonus, 0.5)

  // Clamp to 0-10 range
  score = Math.min(10, Math.max(0, score))

  // Determine level from final score
  let level: GameExperienceLevel = 'beginner'
  if (score >= 7) level = 'advanced'
  else if (score >= 4) level = 'intermediate'
  if (data.tournamentLevel === 'professional') level = 'pro'

  return { level, score: Math.round(score * 10) / 10 }
}

/**
 * Calculates fitness level and score from form data.
 *
 * Algorithm:
 * - Base score from activity level (1-9)
 * - Bonus for additional training
 * - Endurance modifier (-1 to +2)
 * - Injury penalty (0 to -2)
 * - Final score clamped to 0-10
 */
export function calculateFitness(
  data: OnboardingFormData['fitness']
): { level: FitnessLevel; score: number } {
  if (!data) return { level: 'low', score: 0 }

  // Base score from activity level
  const activityBase: Record<string, number> = {
    sedentary: 1,
    light: 3,
    moderate: 5,
    active: 7,
    very_active: 9,
  }

  let score = activityBase[data.activityLevel || 'sedentary']

  // Training bonus
  if (data.additionalTraining && data.additionalTraining.length > 0 && !data.additionalTraining.includes('none')) {
    score += 1
  }

  // Endurance modifier
  const enduranceBonus: Record<string, number> = {
    poor: -1,
    fair: 0,
    good: 1,
    excellent: 2,
  }
  score += enduranceBonus[data.endurance || 'fair']

  // Injury penalty
  if (data.injuryStatus === 'recovering') score -= 1
  if (data.injuryStatus === 'chronic') score -= 2

  // Clamp to 0-10 range
  score = Math.min(10, Math.max(0, score))

  // Determine level from final score
  let level: FitnessLevel = 'low'
  if (score >= 8) level = 'excellent'
  else if (score >= 6) level = 'good'
  else if (score >= 3) level = 'moderate'

  return { level, score: Math.round(score * 10) / 10 }
}

/**
 * Generates full player classification from onboarding form data.
 */
export function classifyPlayer(data: OnboardingFormData): PlayerClassification {
  const gameExperience = calculateGameExperience(data.gameExperience)
  const fitness = calculateFitness(data.fitness)

  return {
    gameExperience,
    fitness,
    lifestyle: {
      motivation: data.lifestyle?.motivation || 'fun',
      weeklyHours: data.lifestyle?.weeklyHours || 'minimal',
      preferredTime: data.lifestyle?.preferredTime || 'flexible',
      sleepQuality: data.lifestyle?.sleepQuality || 'fair',
      lifeContext: data.lifestyle?.lifeContext || 'flexible',
    },
  }
}
