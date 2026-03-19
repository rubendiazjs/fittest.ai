import { supabase } from '@/lib/supabase'
import type { CheckinResponseValue, CheckinStreak } from '../types'

interface SubmitResponseParams {
  userId: string
  questionId: string
  responseValue: CheckinResponseValue
}

interface SkipQuestionParams {
  userId: string
  questionId: string
}

/**
 * Submit a response to a check-in question.
 * Also updates the user's streak.
 */
export async function submitResponse({
  userId,
  questionId,
  responseValue,
}: SubmitResponseParams): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  // Insert response (upsert to handle re-submissions)
  const { error: responseError } = await supabase
    .from('checkin_responses')
    .upsert(
      {
        user_id: userId,
        question_id: questionId,
        response_value: responseValue,
        skipped: false,
        response_date: today,
        responded_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,question_id,response_date',
      }
    )

  if (responseError) {
    throw new Error(`Failed to submit response: ${responseError.message}`)
  }

  // Update streak
  await updateStreak(userId, today)
}

/**
 * Skip a question for today.
 * The skip is recorded but doesn't break the streak.
 */
export async function skipQuestion({
  userId,
  questionId,
}: SkipQuestionParams): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  // Insert skip record
  const { error: responseError } = await supabase
    .from('checkin_responses')
    .upsert(
      {
        user_id: userId,
        question_id: questionId,
        response_value: null,
        skipped: true,
        response_date: today,
        responded_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,question_id,response_date',
      }
    )

  if (responseError) {
    throw new Error(`Failed to skip question: ${responseError.message}`)
  }

  // Update streak (skips maintain streak)
  await updateStreak(userId, today)
}

/**
 * Update user's streak data.
 * Called after any check-in interaction (response or skip).
 */
async function updateStreak(userId: string, today: string): Promise<void> {
  // Fetch current streak data
  const { data: existingStreak, error: fetchError } = await supabase
    .from('checkin_streaks')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (fetchError) {
    throw new Error(`Failed to fetch streak: ${fetchError.message}`)
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]

  let newStreak: Partial<CheckinStreak>

  if (!existingStreak) {
    // First check-in ever
    newStreak = {
      currentStreak: 1,
      longestStreak: 1,
      totalCheckins: 1,
      lastCheckinDate: today,
    }

    const { error: insertError } = await supabase
      .from('checkin_streaks')
      .insert({
        user_id: userId,
        current_streak: newStreak.currentStreak,
        longest_streak: newStreak.longestStreak,
        total_checkins: newStreak.totalCheckins,
        last_checkin_date: newStreak.lastCheckinDate,
      })

    if (insertError) {
      throw new Error(`Failed to create streak: ${insertError.message}`)
    }
  } else {
    // Already checked in today - don't double count
    if (existingStreak.last_checkin_date === today) {
      return
    }

    const currentStreak = existingStreak.current_streak ?? 0
    const longestStreak = existingStreak.longest_streak ?? 0
    const totalCheckins = existingStreak.total_checkins ?? 0

    // Check if streak continues (last check-in was yesterday)
    const streakContinues = existingStreak.last_checkin_date === yesterdayStr

    const updatedCurrentStreak = streakContinues ? currentStreak + 1 : 1
    const updatedLongestStreak = Math.max(longestStreak, updatedCurrentStreak)

    const { error: updateError } = await supabase
      .from('checkin_streaks')
      .update({
        current_streak: updatedCurrentStreak,
        longest_streak: updatedLongestStreak,
        total_checkins: totalCheckins + 1,
        last_checkin_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)

    if (updateError) {
      throw new Error(`Failed to update streak: ${updateError.message}`)
    }
  }
}
