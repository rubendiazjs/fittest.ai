import { supabase } from '@/lib/supabase'
import {
  type CheckinQuestion,
  type CheckinStreak,
  type CheckinResponse,
  type CheckinResponseRow,
  parseQuestion,
  parseStreak,
} from '../types'

/**
 * Fetch all available check-in questions.
 */
export async function fetchQuestions(): Promise<CheckinQuestion[]> {
  const { data, error } = await supabase
    .from('checkin_questions')
    .select('*')
    .order('priority', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch questions: ${error.message}`)
  }

  return (data ?? []).map(parseQuestion)
}

/**
 * Fetch user's recent responses within the specified number of days.
 */
export async function fetchRecentResponses(
  userId: string,
  days: number = 30
): Promise<CheckinResponse[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('checkin_responses')
    .select('*')
    .eq('user_id', userId)
    .gte('response_date', startDate.toISOString().split('T')[0])
    .order('response_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch responses: ${error.message}`)
  }

  return (data ?? []).map(parseResponse)
}

/**
 * Check if user has already responded today.
 */
export async function fetchTodayResponse(
  userId: string
): Promise<CheckinResponse | null> {
  const today = new Date().toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('checkin_responses')
    .select('*')
    .eq('user_id', userId)
    .eq('response_date', today)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch today's response: ${error.message}`)
  }

  return data ? parseResponse(data) : null
}

/**
 * Fetch user's streak data.
 */
export async function fetchStreak(userId: string): Promise<CheckinStreak | null> {
  const { data, error } = await supabase
    .from('checkin_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to fetch streak: ${error.message}`)
  }

  return data ? parseStreak(data) : null
}

/**
 * Parse a response row from the database.
 */
function parseResponse(row: CheckinResponseRow): CheckinResponse {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    responseValue: row.response_value as CheckinResponse['responseValue'],
    skipped: row.skipped ?? false,
    responseDate: row.response_date,
    respondedAt: row.responded_at ?? new Date().toISOString(),
  }
}
