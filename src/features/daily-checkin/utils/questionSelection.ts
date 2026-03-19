import type { CheckinQuestion, CheckinResponse } from '../types'

interface SelectionContext {
  injuryStatus?: string
  hadRecentMatch?: boolean
}

interface ScoredQuestion {
  question: CheckinQuestion
  score: number
}

/**
 * Select the best question to show today based on:
 * 1. Cooldown filtering (skip if answered within cooldown_days)
 * 2. Priority boosting based on trigger conditions
 * 3. Injury status boosting for pain-related questions
 * 4. Slight randomization for variety
 */
export function selectTodayQuestion(
  questions: CheckinQuestion[],
  recentResponses: CheckinResponse[],
  context: SelectionContext = {}
): CheckinQuestion | null {
  if (questions.length === 0) {
    return null
  }

  // Build a map of question_id -> last response date
  const lastResponseByQuestion = new Map<string, string>()
  for (const response of recentResponses) {
    const existing = lastResponseByQuestion.get(response.questionId)
    if (!existing || response.responseDate > existing) {
      lastResponseByQuestion.set(response.questionId, response.responseDate)
    }
  }

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Score each question
  const scoredQuestions: ScoredQuestion[] = []

  for (const question of questions) {
    // Check cooldown
    const lastResponse = lastResponseByQuestion.get(question.id)
    if (lastResponse) {
      const daysSinceResponse = getDaysBetween(lastResponse, todayStr)
      if (daysSinceResponse < question.cooldownDays) {
        // Still on cooldown, skip this question
        continue
      }
    }

    // Base score from priority (0-100)
    let score = question.priority

    // Boost for trigger conditions
    if (question.triggerConditions) {
      if (question.triggerConditions.afterMatch && context.hadRecentMatch) {
        score += 30
      }
      if (question.triggerConditions.lowEnergy) {
        // Could be boosted based on previous energy responses
        score += 5
      }
    }

    // Boost pain/soreness questions if user has injury
    if (context.injuryStatus && context.injuryStatus !== 'none') {
      if (
        question.slug === 'pain_location' ||
        question.slug === 'muscle_soreness' ||
        question.subcategory === 'pain'
      ) {
        score += 25
      }
    }

    // Add slight randomization (±10 points) for variety
    score += Math.random() * 20 - 10

    scoredQuestions.push({ question, score })
  }

  if (scoredQuestions.length === 0) {
    // All questions are on cooldown, pick the one with oldest response
    return selectOldestUnanswered(questions, lastResponseByQuestion)
  }

  // Sort by score descending and pick the top one
  scoredQuestions.sort((a, b) => b.score - a.score)

  return scoredQuestions[0].question
}

/**
 * Fallback: select the question that was answered longest ago.
 */
function selectOldestUnanswered(
  questions: CheckinQuestion[],
  lastResponseByQuestion: Map<string, string>
): CheckinQuestion | null {
  let oldestQuestion: CheckinQuestion | null = null
  let oldestDate: string | null = null

  for (const question of questions) {
    const lastResponse = lastResponseByQuestion.get(question.id)

    if (!lastResponse) {
      // Never answered - prioritize this
      return question
    }

    if (!oldestDate || lastResponse < oldestDate) {
      oldestDate = lastResponse
      oldestQuestion = question
    }
  }

  return oldestQuestion
}

/**
 * Calculate days between two date strings (YYYY-MM-DD).
 */
function getDaysBetween(dateStr1: string, dateStr2: string): number {
  const date1 = new Date(dateStr1)
  const date2 = new Date(dateStr2)
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}
