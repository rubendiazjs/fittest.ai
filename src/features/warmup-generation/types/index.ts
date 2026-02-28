import type { Tables } from '@/lib/database.types'

// Database row type
export type WarmUpSession = Tables<'warmup_sessions'>

// RAMP Framework phases
export type RAMPPhase = 'raise' | 'activate' | 'mobilise' | 'potentiate' | 'sport_specific'

// Individual drill/exercise in the warm-up
export interface WarmUpDrill {
  name: string
  duration: string // e.g., "60 seconds" or "10 reps each side"
  intensity: number // RPE 1-10
  coaching_cues: string[] // 1-2 cues
  common_mistake: string // 1 mistake to avoid
  video_search_query: string // YouTube search query for this exercise
  notes?: string

  // Guided execution fields (AI-generated)
  execution_steps: string[] // Step-by-step instructions (3-5 steps)
  objective: string // Why this drill helps prepare for match
  expected_sensation_during: string // What to feel while doing it
  expected_sensation_after: string // What to feel after completion
  rounds: number // Number of rounds (1-3, AI decides)
  rest_seconds: number // Rest between rounds (0-30, AI decides)
}

// A phase/block in the warm-up timeline
export interface WarmUpPhase {
  phase: RAMPPhase
  phase_label: string // e.g., "Raise", "Activate & Mobilise"
  timestamp: string // e.g., "0:00–2:00"
  drills: WarmUpDrill[]
}

// Adaptations for different conditions
export interface WarmUpAdaptations {
  cold_conditions: string
  if_irritated: string
}

// Ready-to-play checklist
export interface ReadyToPlayChecklist {
  physical_signs: string[]
  neurological_signs: string[]
}

// Full warm-up response from AI
export interface WarmUp {
  id: string | null
  title: string
  duration_minutes: number
  phases: WarmUpPhase[]
  adaptations: WarmUpAdaptations
  ready_checklist: ReadyToPlayChecklist
  generated_at?: string
}

// Edge Function response
export interface GenerateWarmUpResponse {
  success: boolean
  warmup: WarmUp
  error?: string
}

// Check-in context for daily data
export interface CheckinContext {
  energy_level?: number
  sleep_quality?: string
  pain_zones?: string[]
  sore_muscles?: string[]
  stress_level?: number
  recovery_status?: string
  playing_frequency?: string
  weak_shots?: string[]
  confident_shots?: string[]
}

// Input context for warm-up generation
export interface WarmUpGenerationContext {
  // Player profile (from database)
  sport: string
  match_type: 'singles' | 'doubles'
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'competitive'
  age?: number
  training_background: string

  // Context (can be provided at generation time)
  duration_minutes: number
  environment: 'cold_outdoor' | 'hot_outdoor' | 'indoor'
  space: 'on_court' | 'off_court' | 'limited'
  equipment: string[]
  match_timing: 'immediately' | 'in_10_15_min'

  // Health
  injuries: string
  priority_areas: string
  fatigue_level: 'fresh' | 'normal' | 'tired'

  // Desired outcome
  desired_outcome: string

  // Daily check-in data (optional)
  checkin?: CheckinContext
}

// User feedback structure (for post-match)
export interface WarmUpFeedback {
  sensations_felt: string[]
  match_performance_notes: string
  rating: number // 1-5
  submitted_at: string
}

// State for guided warm-up flow
export interface GuidedWarmUpState {
  currentPhaseIndex: number
  currentDrillIndex: number
  currentRound: number
  completedRounds: Set<number>
  isResting: boolean
  restTimeRemaining: number
  isComplete: boolean
  startedAt: Date | null
  completedAt: Date | null
}

// Flattened drill reference for easy navigation
export interface FlatDrillReference {
  phaseIndex: number
  drillIndex: number
  phase: WarmUpPhase
  drill: WarmUpDrill
  globalIndex: number
  totalDrills: number
}

// Phase labels for display
export const PHASE_LABELS: Record<RAMPPhase, string> = {
  raise: 'Elevar',
  activate: 'Activar',
  mobilise: 'Movilizar',
  potentiate: 'Potenciar',
  sport_specific: 'Específico del Deporte',
}

// Phase colors for UI
export const PHASE_COLORS: Record<RAMPPhase, string> = {
  raise: 'bg-red-100 text-red-800 border-red-200',
  activate: 'bg-orange-100 text-orange-800 border-orange-200',
  mobilise: 'bg-blue-100 text-blue-800 border-blue-200',
  potentiate: 'bg-purple-100 text-purple-800 border-purple-200',
  sport_specific: 'bg-green-100 text-green-800 border-green-200',
}

// Intensity color based on RPE
export function getIntensityColor(rpe: number): string {
  if (rpe <= 3) return 'text-green-600'
  if (rpe <= 5) return 'text-yellow-600'
  if (rpe <= 7) return 'text-orange-600'
  return 'text-red-600'
}

// Build YouTube search URL from query
export function buildYouTubeSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query)
  return `https://www.youtube.com/results?search_query=${encoded}`
}
