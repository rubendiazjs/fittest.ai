import { useCallback, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, X, PartyPopper } from 'lucide-react'
import type { WarmUp } from '../types'
import { useGuidedWarmUp } from '../hooks'
import { getDrillAtIndex } from '../utils'
import { GuidedProgressBar } from './GuidedProgressBar'
import { DrillExecutionCard } from './DrillExecutionCard'
import { RoundTracker } from './RoundTracker'
import { RestTimer } from './RestTimer'

interface WarmUpGuidedViewProps {
  warmup: WarmUp
  onComplete: () => void
  onExit: () => void
  onVideoClick?: (drillName: string, query: string) => void
}

export function WarmUpGuidedView({
  warmup,
  onComplete,
  onExit,
  onVideoClick,
}: WarmUpGuidedViewProps) {
  const {
    state,
    currentDrillRef,
    flatDrills,
    actions,
    computed,
  } = useGuidedWarmUp(warmup)

  // Start warm-up on mount
  useEffect(() => {
    if (!state.startedAt) {
      actions.startWarmUp()
    }
  }, [state.startedAt, actions])

  // Handle round completion with rest timer logic
  const handleRoundComplete = useCallback((round: number) => {
    actions.completeRound(round)

    const currentDrill = currentDrillRef?.drill
    if (!currentDrill) return

    // Check if we need rest after this round
    const willHaveMoreRounds = round < currentDrill.rounds
    const hasRestTime = currentDrill.rest_seconds > 0

    if (willHaveMoreRounds && hasRestTime) {
      actions.startRest(currentDrill.rest_seconds)
    }
  }, [actions, currentDrillRef])

  // Handle rest completion
  const handleRestComplete = useCallback(() => {
    actions.finishRest()
  }, [actions])

  // Handle video click with tracking
  const handleVideoClick = useCallback((query: string) => {
    if (onVideoClick && currentDrillRef) {
      onVideoClick(currentDrillRef.drill.name, query)
    }
  }, [onVideoClick, currentDrillRef])

  // Get next drill for rest timer preview
  const nextDrillRef = !computed.isLastDrill
    ? getDrillAtIndex(flatDrills, computed.currentDrillNumber) // currentDrillNumber is 1-indexed, so this gets next
    : null

  // Completion screen
  if (state.isComplete) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center pb-2">
            <PartyPopper className="h-12 w-12 mx-auto text-green-600 mb-2" />
            <CardTitle className="text-2xl text-green-800">
              Calentamiento Completado
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-green-700">
              Has completado todos los ejercicios del calentamiento.
            </p>

            {/* Ready checklist reminder */}
            {warmup.ready_checklist && (
              <div className="text-left bg-white rounded-lg p-4 space-y-3">
                <div className="font-medium text-green-800">
                  Verifica que sientes:
                </div>
                <div className="space-y-2">
                  {warmup.ready_checklist.physical_signs.map((sign, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-green-700">
                      <span>✓</span> {sign}
                    </div>
                  ))}
                  {warmup.ready_checklist.neurological_signs.map((sign, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-green-700">
                      <span>✓</span> {sign}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-center">
            <Button onClick={onComplete} size="lg" className="bg-green-600 hover:bg-green-700">
              ¡A jugar!
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!currentDrillRef) {
    return null
  }

  const { drill, phase } = currentDrillRef

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Header with exit button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit}>
          <X className="h-4 w-4 mr-1" />
          Salir
        </Button>
        <div className="text-sm text-muted-foreground">
          {warmup.title}
        </div>
      </div>

      {/* Progress bar */}
      <GuidedProgressBar
        currentDrill={computed.currentDrillNumber}
        totalDrills={computed.totalDrills}
        phaseLabel={currentDrillRef.phase.phase_label}
        phase={phase.phase}
      />

      {/* Rest timer or drill content */}
      {state.isResting ? (
        <RestTimer
          seconds={state.restTimeRemaining}
          onComplete={handleRestComplete}
          nextDrillName={
            computed.allRoundsComplete && nextDrillRef
              ? nextDrillRef.drill.name
              : undefined
          }
        />
      ) : (
        <>
          {/* Drill execution card */}
          <DrillExecutionCard
            drill={drill}
            phase={phase.phase}
            onVideoClick={handleVideoClick}
          />

          {/* Round tracker */}
          <Card>
            <CardContent className="pt-6">
              <RoundTracker
                totalRounds={drill.rounds || 1}
                completedRounds={state.completedRounds}
                currentRound={state.currentRound}
                onRoundComplete={handleRoundComplete}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={actions.goToPreviousDrill}
          disabled={computed.isFirstDrill}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Anterior
        </Button>

        {computed.allRoundsComplete ? (
          <Button onClick={actions.goToNextDrill}>
            {computed.isLastDrill ? (
              'Finalizar'
            ) : (
              <>
                Siguiente
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        ) : (
          <Button variant="ghost" onClick={actions.goToNextDrill}>
            Saltar ejercicio
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>
    </div>
  )
}
