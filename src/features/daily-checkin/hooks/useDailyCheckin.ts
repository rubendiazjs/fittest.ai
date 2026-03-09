import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from '@/features/auth/AuthProvider'
import {
  checkinKeys,
  fetchQuestions,
  fetchRecentResponses,
  fetchTodayResponse,
  fetchStreak,
  submitResponse,
  skipQuestion,
} from '../api'
import { selectTodayQuestion } from '../utils/questionSelection'
import type { CheckinResponseValue } from '../types'

interface UseDailyCheckinOptions {
  /** User's injury status for question prioritization */
  injuryStatus?: string
  /** Whether user had a recent match */
  hadRecentMatch?: boolean
}

/**
 * Main hook for the daily check-in feature.
 *
 * Handles:
 * - Fetching questions and selecting today's question
 * - Checking if user already responded today
 * - Submitting responses
 * - Skipping questions
 * - Managing streak data
 *
 * @example
 * const {
 *   todayQuestion,
 *   hasCheckedInToday,
 *   streak,
 *   isLoading,
 *   submitCheckin,
 *   skipCheckin,
 * } = useDailyCheckin()
 */
export function useDailyCheckin(options: UseDailyCheckinOptions = {}) {
  const { user } = useAuth()
  const userId = user?.id ?? ''
  const queryClient = useQueryClient()

  // Fetch all questions
  const questionsQuery = useQuery({
    queryKey: checkinKeys.questions(),
    queryFn: fetchQuestions,
    enabled: !!userId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours - questions rarely change
  })

  // Fetch recent responses for cooldown calculation
  const recentResponsesQuery = useQuery({
    queryKey: checkinKeys.responsesRecent(userId, 30),
    queryFn: () => fetchRecentResponses(userId, 30),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Check if already responded today
  const todayResponseQuery = useQuery({
    queryKey: checkinKeys.todayResponse(userId),
    queryFn: () => fetchTodayResponse(userId),
    enabled: !!userId,
    staleTime: 60 * 1000, // 1 minute
  })

  // Fetch streak data
  const streakQuery = useQuery({
    queryKey: checkinKeys.streak(userId),
    queryFn: () => fetchStreak(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Select today's question based on cooldown and priority
  const todayQuestion = useMemo(() => {
    if (!questionsQuery.data || !recentResponsesQuery.data) {
      return null
    }

    return selectTodayQuestion(
      questionsQuery.data,
      recentResponsesQuery.data,
      {
        injuryStatus: options.injuryStatus,
        hadRecentMatch: options.hadRecentMatch,
      }
    )
  }, [
    questionsQuery.data,
    recentResponsesQuery.data,
    options.injuryStatus,
    options.hadRecentMatch,
  ])

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: (value: CheckinResponseValue) => {
      if (!todayQuestion) {
        throw new Error('No question to submit')
      }
      return submitResponse({
        userId: userId,
        questionId: todayQuestion.id,
        responseValue: value,
      })
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: checkinKeys.todayResponse(userId) })
      queryClient.invalidateQueries({ queryKey: checkinKeys.responses(userId) })
      queryClient.invalidateQueries({ queryKey: checkinKeys.streak(userId) })
    },
  })

  // Skip mutation
  const skipMutation = useMutation({
    mutationFn: () => {
      if (!todayQuestion) {
        throw new Error('No question to skip')
      }
      return skipQuestion({
        userId: userId,
        questionId: todayQuestion.id,
      })
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: checkinKeys.todayResponse(userId) })
      queryClient.invalidateQueries({ queryKey: checkinKeys.responses(userId) })
      queryClient.invalidateQueries({ queryKey: checkinKeys.streak(userId) })
    },
  })

  // Computed states
  const isLoading =
    questionsQuery.isLoading ||
    recentResponsesQuery.isLoading ||
    todayResponseQuery.isLoading ||
    streakQuery.isLoading

  const hasCheckedInToday = !!todayResponseQuery.data

  const isSubmitting = submitMutation.isPending || skipMutation.isPending

  return {
    // Data
    todayQuestion,
    hasCheckedInToday,
    streak: streakQuery.data ?? null,

    // Loading states
    isLoading,
    isSubmitting,

    // Errors
    error:
      questionsQuery.error ||
      recentResponsesQuery.error ||
      todayResponseQuery.error ||
      streakQuery.error ||
      submitMutation.error ||
      skipMutation.error,

    // Actions
    submitCheckin: submitMutation.mutate,
    skipCheckin: skipMutation.mutate,
  }
}
