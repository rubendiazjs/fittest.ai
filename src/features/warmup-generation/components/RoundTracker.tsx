import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RoundTrackerProps {
  totalRounds: number
  completedRounds: Set<number>
  currentRound: number
  onRoundComplete: (round: number) => void
  disabled?: boolean
}

export function RoundTracker({
  totalRounds,
  completedRounds,
  currentRound,
  onRoundComplete,
  disabled = false,
}: RoundTrackerProps) {
  // Generate array of round numbers [1, 2, 3, ...]
  const rounds = Array.from({ length: totalRounds }, (_, i) => i + 1)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {totalRounds === 1 ? 'Serie' : 'Series'}
        </span>
        <span className="text-sm text-muted-foreground">
          {completedRounds.size} / {totalRounds}
        </span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {rounds.map((round) => {
          const isCompleted = completedRounds.has(round)
          const isCurrent = round === currentRound && !isCompleted
          const isFuture = round > currentRound && !isCompleted

          return (
            <Button
              key={round}
              variant={isCompleted ? 'default' : 'outline'}
              size="lg"
              disabled={disabled || isCompleted || isFuture}
              onClick={() => onRoundComplete(round)}
              className={cn(
                'w-14 h-14 text-lg font-bold transition-all',
                isCompleted && 'bg-green-600 hover:bg-green-700',
                isCurrent && 'border-primary border-2 ring-2 ring-primary/20',
                isFuture && 'opacity-50'
              )}
            >
              {isCompleted ? (
                <Check className="h-6 w-6" />
              ) : (
                round
              )}
            </Button>
          )
        })}
      </div>

      {/* Completion message */}
      {completedRounds.size === totalRounds && totalRounds > 0 && (
        <div className="text-center text-sm text-green-600 font-medium pt-1">
          Ejercicio completado
        </div>
      )}
    </div>
  )
}
