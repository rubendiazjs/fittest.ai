import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SkipForward, Pause, Play } from 'lucide-react'
import { useRestTimer } from '../hooks'

interface RestTimerProps {
  seconds: number
  onComplete: () => void
  nextDrillName?: string
}

export function RestTimer({ seconds, onComplete, nextDrillName }: RestTimerProps) {
  const timer = useRestTimer({
    initialSeconds: seconds,
    onComplete,
    autoStart: true,
  })

  // Format seconds as MM:SS or just seconds if < 60
  const formatTime = (secs: number): string => {
    if (secs >= 60) {
      const mins = Math.floor(secs / 60)
      const remainingSecs = secs % 60
      return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
    }
    return `${secs}`
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="pt-6 text-center space-y-4">
        {/* Rest indicator */}
        <div className="text-blue-600 font-medium text-sm uppercase tracking-wide">
          Descanso
        </div>

        {/* Large countdown */}
        <div className="text-6xl font-bold text-blue-700 tabular-nums">
          {formatTime(timer.seconds)}
        </div>

        {/* Progress bar */}
        <Progress value={timer.progress} className="h-2" />

        {/* Next drill preview */}
        {nextDrillName && (
          <div className="text-sm text-muted-foreground">
            Siguiente: <span className="font-medium">{nextDrillName}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-2 pt-2">
          {timer.isRunning ? (
            <Button
              variant="outline"
              size="sm"
              onClick={timer.actions.pause}
              className="text-blue-600"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pausar
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={timer.actions.resume}
              className="text-blue-600"
            >
              <Play className="h-4 w-4 mr-1" />
              Continuar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={timer.actions.skip}
            className="text-muted-foreground"
          >
            <SkipForward className="h-4 w-4 mr-1" />
            Saltar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
