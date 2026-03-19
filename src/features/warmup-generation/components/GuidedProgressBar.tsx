import { Progress } from '@/components/ui/progress'
import { PHASE_COLORS, type RAMPPhase } from '../types'

interface GuidedProgressBarProps {
  currentDrill: number // 1-indexed
  totalDrills: number
  phaseLabel: string
  phase: RAMPPhase
}

export function GuidedProgressBar({
  currentDrill,
  totalDrills,
  phaseLabel,
  phase,
}: GuidedProgressBarProps) {
  const progress = totalDrills > 0 ? ((currentDrill - 1) / totalDrills) * 100 : 0
  const phaseColors = PHASE_COLORS[phase]

  // Extract just the text color from the phase colors
  const textColorClass = phaseColors.split(' ').find((c) => c.startsWith('text-')) || 'text-primary'
  const bgColorClass = phaseColors.split(' ').find((c) => c.startsWith('bg-')) || 'bg-primary/10'

  return (
    <div className="space-y-2">
      {/* Phase badge and progress text */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${bgColorClass} ${textColorClass}`}
        >
          {phaseLabel}
        </span>
        <span className="text-sm text-muted-foreground">
          Ejercicio <span className="font-medium text-foreground">{currentDrill}</span> de{' '}
          <span className="font-medium text-foreground">{totalDrills}</span>
        </span>
      </div>

      {/* Progress bar */}
      <Progress value={progress} className="h-2" />
    </div>
  )
}
