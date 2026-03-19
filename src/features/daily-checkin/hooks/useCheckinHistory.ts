import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/features/auth'
import { checkinKeys } from '../api'

export interface CheckinHistoryItem {
  id: string
  questionId: string
  questionSlug: string
  questionTitle: string
  questionCategory: 'physical_state' | 'performance'
  inputType: string
  responseValue: unknown
  skipped: boolean
  responseDate: string
  respondedAt: string
}

interface CheckinHistoryRow {
  id: string
  question_id: string
  response_value: unknown
  skipped: boolean | null
  response_date: string
  responded_at: string
  checkin_questions: {
    slug: string
    title_es: string
    category: 'physical_state' | 'performance'
    input_type: string
  }
}

/**
 * Fetch check-in history for a user.
 * Returns responses with question details for display.
 */
async function fetchCheckinHistory(
  userId: string,
  days: number = 30
): Promise<CheckinHistoryItem[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('checkin_responses')
    .select(`
      id,
      question_id,
      response_value,
      skipped,
      response_date,
      responded_at,
      checkin_questions!inner(
        slug,
        title_es,
        category,
        input_type,
        options
      )
    `)
    .eq('user_id', userId)
    .gte('response_date', startDate.toISOString().split('T')[0])
    .order('response_date', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch check-in history: ${error.message}`)
  }

  return ((data ?? []) as CheckinHistoryRow[]).map((row) => ({
    id: row.id,
    questionId: row.question_id,
    questionSlug: row.checkin_questions.slug,
    questionTitle: row.checkin_questions.title_es,
    questionCategory: row.checkin_questions.category,
    inputType: row.checkin_questions.input_type,
    responseValue: row.response_value,
    skipped: row.skipped ?? false,
    responseDate: row.response_date,
    respondedAt: row.responded_at,
  }))
}

/**
 * Hook for fetching check-in history.
 *
 * @example
 * const { data: history, isLoading } = useCheckinHistory(30)
 */
export function useCheckinHistory(days: number = 30) {
  const { user } = useAuth()
  const userId = user?.id ?? ''

  return useQuery({
    queryKey: [...checkinKeys.responses(userId), 'history', days],
    queryFn: () => fetchCheckinHistory(userId, days),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
