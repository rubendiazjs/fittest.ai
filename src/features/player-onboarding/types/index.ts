// Player Onboarding Types

// === Game Experience Classification ===
export type GameExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro'
export type PlayingFrequency = 'occasional' | 'weekly' | 'frequent' | 'daily'
export type TournamentLevel = 'none' | 'local' | 'federated' | 'professional'

export const PADEL_SKILLS = [
  'basic_shots',
  'volleys',
  'lobs_bandejas',
  'wall_rebounds',
  'smash',
  'positioning',
] as const
export type PadelSkill = (typeof PADEL_SKILLS)[number]

// === Fitness Classification ===
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
export type FitnessLevel = 'low' | 'moderate' | 'good' | 'excellent'
export type EnduranceLevel = 'poor' | 'fair' | 'good' | 'excellent'
export type InjuryStatus = 'none' | 'minor' | 'recovering' | 'chronic'
export type PhysicalGoal = 'endurance' | 'strength' | 'weight_loss' | 'injury_prevention' | 'peak_performance'

// === Lifestyle Classification ===
export type Motivation = 'fun' | 'health' | 'improvement' | 'competition'
export type WeeklyTrainingHours = 'minimal' | 'light' | 'moderate' | 'dedicated'
export type PreferredTrainingTime = 'morning' | 'midday' | 'evening' | 'weekend' | 'flexible'
export type SleepQuality = 'poor' | 'fair' | 'good' | 'excellent'
export type LifeContext = 'student' | 'professional' | 'parent' | 'flexible' | 'irregular'

// === Form Data Interfaces ===
export interface GameExperienceFormData {
  yearsPlaying: 'less_6_months' | '6m_2y' | '2y_5y' | 'more_5y'
  frequency: PlayingFrequency
  selfAssessedLevel: GameExperienceLevel
  tournamentLevel: TournamentLevel
  skills: PadelSkill[]
}

export interface FitnessFormData {
  activityLevel: ActivityLevel
  additionalTraining: ('none' | 'gym' | 'cardio' | 'racquet_sports' | 'multiple')[]
  endurance: EnduranceLevel
  injuryStatus: InjuryStatus
  primaryGoal: PhysicalGoal
}

export interface LifestyleFormData {
  motivation: Motivation
  weeklyHours: WeeklyTrainingHours
  preferredTime: PreferredTrainingTime
  sleepQuality: SleepQuality
  lifeContext: LifeContext
}

export interface OnboardingFormData {
  step: number
  gameExperience?: Partial<GameExperienceFormData>
  fitness?: Partial<FitnessFormData>
  lifestyle?: Partial<LifestyleFormData>
}

// === Main Profile Interface ===
export interface PlayerProfile {
  id: string
  userId: string

  // === DIMENSION 1: Game Experience ===
  gameExperienceLevel: GameExperienceLevel
  gameExperienceScore: number // 0-10

  // Raw form data
  yearsPlaying: GameExperienceFormData['yearsPlaying']
  frequency: PlayingFrequency
  tournamentLevel: TournamentLevel
  skills: PadelSkill[]

  // === DIMENSION 2: Fitness Level ===
  fitnessLevel: FitnessLevel
  fitnessScore: number // 0-10

  // Raw form data
  activityLevel: ActivityLevel
  endurance: EnduranceLevel
  injuryStatus: InjuryStatus
  primaryGoal: PhysicalGoal

  // === DIMENSION 3: Lifestyle ===
  // No score - this is a profile, not a ranking
  motivation: Motivation
  weeklyHours: WeeklyTrainingHours
  preferredTime: PreferredTrainingTime
  sleepQuality: SleepQuality
  lifeContext: LifeContext

  // === Metadata ===
  createdAt: Date
  updatedAt: Date
}

// === Classification Result ===
export interface PlayerClassification {
  gameExperience: {
    level: GameExperienceLevel
    score: number // 0-10
  }
  fitness: {
    level: FitnessLevel
    score: number // 0-10
  }
  lifestyle: LifestyleProfile
}

export interface LifestyleProfile {
  motivation: Motivation
  weeklyHours: WeeklyTrainingHours
  preferredTime: PreferredTrainingTime
  sleepQuality: SleepQuality
  lifeContext: LifeContext
}
