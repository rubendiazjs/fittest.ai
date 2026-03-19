import { useState, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { WelcomeStep } from './WelcomeStep'
import { QuestionView } from './QuestionView'
import { ResultStep } from './ResultStep'
import { QUESTIONS, TOTAL_QUESTIONS } from './questions'
import { profileKeys } from '../api/keys'
import type { OnboardingFormData, PadelSkill } from '../types'

type Phase = 'welcome' | 'questions' | 'result'

export function OnboardingWizard() {
  const queryClient = useQueryClient()
  const [phase, setPhase] = useState<Phase>('welcome')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  const currentQuestion = QUESTIONS[currentQuestionIndex]

  const handleStart = useCallback(() => {
    setPhase('questions')
  }, [])

  const handleAnswer = useCallback((value: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }, [currentQuestion])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setPhase('result')
    }
  }, [currentQuestionIndex])

  const handleBack = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    } else {
      setPhase('welcome')
    }
  }, [currentQuestionIndex])

  const handleBackToQuestions = useCallback(() => {
    setPhase('questions')
    setCurrentQuestionIndex(TOTAL_QUESTIONS - 1)
  }, [])

  // Called when profile is saved successfully
  // Invalidate profile query → App re-renders → shows ProfileDashboard
  const handleProfileSaved = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: profileKeys.all })
  }, [queryClient])

  // Convert answers to form data structure
  const getFormData = (): OnboardingFormData => {
    return {
      step: currentQuestionIndex,
      gameExperience: {
        yearsPlaying: answers.yearsPlaying as OnboardingFormData['gameExperience'] extends { yearsPlaying: infer T } ? T : never,
        frequency: answers.frequency as 'occasional' | 'weekly' | 'frequent' | 'daily',
        selfAssessedLevel: answers.selfAssessedLevel as 'beginner' | 'intermediate' | 'advanced' | 'pro',
        tournamentLevel: answers.tournamentLevel as 'none' | 'local' | 'federated' | 'professional',
        skills: (answers.skills as PadelSkill[]) || [],
      },
      fitness: {
        activityLevel: answers.activityLevel as 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
        additionalTraining: (answers.additionalTraining as ('none' | 'gym' | 'cardio' | 'racquet_sports' | 'multiple')[]) || [],
        endurance: answers.endurance as 'poor' | 'fair' | 'good' | 'excellent',
        injuryStatus: answers.injuryStatus as 'none' | 'minor' | 'recovering' | 'chronic',
        primaryGoal: answers.primaryGoal as 'endurance' | 'strength' | 'weight_loss' | 'injury_prevention' | 'peak_performance',
      },
      lifestyle: {
        motivation: answers.motivation as 'fun' | 'health' | 'improvement' | 'competition',
        weeklyHours: answers.weeklyHours as 'minimal' | 'light' | 'moderate' | 'dedicated',
        preferredTime: answers.preferredTime as 'morning' | 'midday' | 'evening' | 'weekend' | 'flexible',
        sleepQuality: answers.sleepQuality as 'poor' | 'fair' | 'good' | 'excellent',
        lifeContext: answers.lifeContext as 'student' | 'professional' | 'parent' | 'flexible' | 'irregular',
      },
    }
  }

  if (phase === 'welcome') {
    return <WelcomeStep onStart={handleStart} />
  }

  if (phase === 'result') {
    return (
      <ResultStep
        data={getFormData()}
        onBack={handleBackToQuestions}
        onProfileSaved={handleProfileSaved}
      />
    )
  }

  return (
    <QuestionView
      question={currentQuestion}
      currentIndex={currentQuestionIndex}
      totalQuestions={TOTAL_QUESTIONS}
      value={answers[currentQuestion.id]}
      onChange={handleAnswer}
      onNext={handleNext}
      onBack={handleBack}
      canGoBack={true}
    />
  )
}
