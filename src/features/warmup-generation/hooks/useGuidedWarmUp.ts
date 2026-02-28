import { useState, useCallback, useMemo } from 'react'
import type { WarmUp, GuidedWarmUpState, FlatDrillReference } from '../types'
import { flattenDrills, getDrillAtIndex } from '../utils'

interface UseGuidedWarmUpReturn {
  state: GuidedWarmUpState
  currentDrillRef: FlatDrillReference | null
  flatDrills: FlatDrillReference[]
  actions: {
    startWarmUp: () => void
    completeRound: (round: number) => void
    startRest: (seconds: number) => void
    finishRest: () => void
    goToNextDrill: () => void
    goToPreviousDrill: () => void
    exitGuided: () => void
  }
  computed: {
    isLastDrill: boolean
    isFirstDrill: boolean
    progress: number // 0-100
    allRoundsComplete: boolean
    currentDrillNumber: number
    totalDrills: number
  }
}

const initialState: GuidedWarmUpState = {
  currentPhaseIndex: 0,
  currentDrillIndex: 0,
  currentRound: 1,
  completedRounds: new Set(),
  isResting: false,
  restTimeRemaining: 0,
  isComplete: false,
  startedAt: null,
  completedAt: null,
}

/**
 * Hook for managing the guided warm-up flow state
 */
export function useGuidedWarmUp(warmup: WarmUp): UseGuidedWarmUpReturn {
  const [state, setState] = useState<GuidedWarmUpState>(initialState)

  // Flatten all drills for easy navigation
  const flatDrills = useMemo(() => flattenDrills(warmup), [warmup])

  // Calculate current global index
  const currentGlobalIndex = useMemo(() => {
    let index = 0
    for (let p = 0; p < state.currentPhaseIndex; p++) {
      index += warmup.phases[p].drills.length
    }
    index += state.currentDrillIndex
    return index
  }, [warmup.phases, state.currentPhaseIndex, state.currentDrillIndex])

  // Current drill reference
  const currentDrillRef = useMemo(
    () => getDrillAtIndex(flatDrills, currentGlobalIndex),
    [flatDrills, currentGlobalIndex]
  )

  // Computed values
  const isLastDrill = currentGlobalIndex >= flatDrills.length - 1
  const isFirstDrill = currentGlobalIndex === 0
  const progress = flatDrills.length > 0
    ? (currentGlobalIndex / flatDrills.length) * 100
    : 0

  const currentDrill = currentDrillRef?.drill
  const allRoundsComplete = currentDrill
    ? state.completedRounds.size >= currentDrill.rounds
    : false

  // Actions
  const startWarmUp = useCallback(() => {
    setState((prev) => ({ ...prev, startedAt: new Date() }))
  }, [])

  const completeRound = useCallback((round: number) => {
    setState((prev) => {
      const newCompleted = new Set(prev.completedRounds).add(round)
      return {
        ...prev,
        completedRounds: newCompleted,
        currentRound: Math.min(round + 1, currentDrill?.rounds ?? 1),
      }
    })
  }, [currentDrill?.rounds])

  const startRest = useCallback((seconds: number) => {
    setState((prev) => ({
      ...prev,
      isResting: true,
      restTimeRemaining: seconds,
    }))
  }, [])

  const finishRest = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isResting: false,
      restTimeRemaining: 0,
    }))
  }, [])

  const goToNextDrill = useCallback(() => {
    if (isLastDrill) {
      // Complete the warm-up
      setState((prev) => ({
        ...prev,
        isComplete: true,
        completedAt: new Date(),
      }))
      return
    }

    // Find next drill position
    const nextGlobalIndex = currentGlobalIndex + 1
    const nextDrillRef = getDrillAtIndex(flatDrills, nextGlobalIndex)

    if (nextDrillRef) {
      setState((prev) => ({
        ...prev,
        currentPhaseIndex: nextDrillRef.phaseIndex,
        currentDrillIndex: nextDrillRef.drillIndex,
        currentRound: 1,
        completedRounds: new Set(),
        isResting: false,
        restTimeRemaining: 0,
      }))
    }
  }, [currentGlobalIndex, flatDrills, isLastDrill])

  const goToPreviousDrill = useCallback(() => {
    if (isFirstDrill) return

    // Find previous drill position
    const prevGlobalIndex = currentGlobalIndex - 1
    const prevDrillRef = getDrillAtIndex(flatDrills, prevGlobalIndex)

    if (prevDrillRef) {
      setState((prev) => ({
        ...prev,
        currentPhaseIndex: prevDrillRef.phaseIndex,
        currentDrillIndex: prevDrillRef.drillIndex,
        currentRound: 1,
        completedRounds: new Set(),
        isResting: false,
        restTimeRemaining: 0,
      }))
    }
  }, [currentGlobalIndex, flatDrills, isFirstDrill])

  const exitGuided = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    state,
    currentDrillRef,
    flatDrills,
    actions: {
      startWarmUp,
      completeRound,
      startRest,
      finishRest,
      goToNextDrill,
      goToPreviousDrill,
      exitGuided,
    },
    computed: {
      isLastDrill,
      isFirstDrill,
      progress,
      allRoundsComplete,
      currentDrillNumber: currentGlobalIndex + 1,
      totalDrills: flatDrills.length,
    },
  }
}
