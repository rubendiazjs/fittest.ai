import type { Tables } from '@/lib/database.types'

// Database row types
export type CheckinQuestionRow = Tables<'checkin_questions'>
export type CheckinResponseRow = Tables<'checkin_responses'>
export type CheckinStreakRow = Tables<'checkin_streaks'>

// Input types for questions
export type CheckinInputType =
  | 'slider'
  | 'single_select'
  | 'multi_select'
  | 'body_map'
  | 'text'
  | 'yes_no'

// Question categories
export type CheckinCategory = 'physical_state' | 'performance'

// Option structure for select questions
export interface CheckinOption {
  value: string
  label: string
  description?: string
}

// Slider config
export interface SliderConfig {
  min: number
  max: number
  labels?: Record<string, string>
}

// Body map config
export interface BodyMapConfig {
  zones: string[]
}

// Parsed question (transforms DB row into typed object)
export interface CheckinQuestion {
  id: string
  slug: string
  category: CheckinCategory
  subcategory?: string
  inputType: CheckinInputType
  titleEs: string
  subtitleEs?: string
  options?: CheckinOption[]
  config?: SliderConfig | BodyMapConfig | Record<string, unknown>
  priority: number
  cooldownDays: number
  triggerConditions?: {
    afterMatch?: boolean
    lowEnergy?: boolean
  }
  aiRelevance: string[]
}

// Response value varies by input type
export type CheckinResponseValue =
  | number // slider
  | string // single_select, text, yes_no
  | string[] // multi_select, body_map

// Parsed response
export interface CheckinResponse {
  id: string
  userId: string
  questionId: string
  responseValue: CheckinResponseValue
  skipped: boolean
  responseDate: string
  respondedAt: string
}

// Streak data
export interface CheckinStreak {
  id: string
  userId: string
  currentStreak: number
  longestStreak: number
  totalCheckins: number
  lastCheckinDate?: string
}

// State for the daily checkin flow
export interface DailyCheckinState {
  hasCheckedInToday: boolean
  todayQuestion: CheckinQuestion | null
  streak: CheckinStreak | null
  isLoading: boolean
  error: Error | null
}

// Transform DB row to parsed question
export function parseQuestion(row: CheckinQuestionRow): CheckinQuestion {
  return {
    id: row.id,
    slug: row.slug,
    category: row.category as CheckinCategory,
    subcategory: row.subcategory ?? undefined,
    inputType: row.input_type as CheckinInputType,
    titleEs: row.title_es,
    subtitleEs: row.subtitle_es ?? undefined,
    options: row.options as unknown as CheckinOption[] | undefined,
    config: row.config as CheckinQuestion['config'],
    priority: row.priority ?? 50,
    cooldownDays: row.cooldown_days ?? 3,
    triggerConditions: row.trigger_conditions as CheckinQuestion['triggerConditions'],
    aiRelevance: row.ai_relevance ?? [],
  }
}

// Transform DB row to parsed streak
export function parseStreak(row: CheckinStreakRow): CheckinStreak {
  return {
    id: row.id,
    userId: row.user_id,
    currentStreak: row.current_streak ?? 0,
    longestStreak: row.longest_streak ?? 0,
    totalCheckins: row.total_checkins ?? 0,
    lastCheckinDate: row.last_checkin_date ?? undefined,
  }
}
