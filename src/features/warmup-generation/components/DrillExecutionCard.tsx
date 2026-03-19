import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, AlertCircle, Play, Target, Zap, CheckCircle2 } from 'lucide-react'
import { getIntensityColor, buildYouTubeSearchUrl, type WarmUpDrill, type RAMPPhase, PHASE_COLORS } from '../types'

interface DrillExecutionCardProps {
  drill: WarmUpDrill
  phaseLabel: string
  phase: RAMPPhase
  onVideoClick?: (query: string) => void
}

export function DrillExecutionCard({
  drill,
  phaseLabel: _phaseLabel, // Available for future use
  phase,
  onVideoClick,
}: DrillExecutionCardProps) {
  const phaseColors = PHASE_COLORS[phase]
  const borderColor = phaseColors.split(' ').find((c) => c.startsWith('border-')) || 'border-primary'

  const handleVideoClick = () => {
    if (onVideoClick && drill.video_search_query) {
      onVideoClick(drill.video_search_query)
    }
    // Open YouTube in new tab
    if (drill.video_search_query) {
      window.open(buildYouTubeSearchUrl(drill.video_search_query), '_blank')
    }
  }

  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardHeader className="pb-3">
        {/* Drill name and metadata */}
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{drill.name}</CardTitle>
          <div className="flex items-center gap-3 shrink-0 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {drill.duration}
            </span>
            <span className={`font-medium ${getIntensityColor(drill.intensity)}`}>
              RPE {drill.intensity}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Objective */}
        {drill.objective && (
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg">
            <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-primary mb-1">Objetivo</div>
              <p className="text-sm text-muted-foreground">{drill.objective}</p>
            </div>
          </div>
        )}

        {/* Execution steps */}
        {drill.execution_steps && drill.execution_steps.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Como ejecutar</div>
            <ol className="space-y-2">
              {drill.execution_steps.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-sm font-medium shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-sm text-muted-foreground pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Expected sensations */}
        {(drill.expected_sensation_during || drill.expected_sensation_after) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {drill.expected_sensation_during && (
              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-blue-700 mb-1">Durante el movimiento</div>
                  <p className="text-xs text-blue-600">{drill.expected_sensation_during}</p>
                </div>
              </div>
            )}
            {drill.expected_sensation_after && (
              <div className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-medium text-green-700 mb-1">Al terminar</div>
                  <p className="text-xs text-green-600">{drill.expected_sensation_after}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coaching cues */}
        {drill.coaching_cues && drill.coaching_cues.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Claves del entrenador</div>
            <ul className="space-y-1.5">
              {drill.coaching_cues.map((cue, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">→</span>
                  {cue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common mistake */}
        {drill.common_mistake && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <AlertCircle className="h-4 w-4 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-medium text-orange-700 mb-1">Evitar</div>
              <p className="text-xs text-orange-600">{drill.common_mistake}</p>
            </div>
          </div>
        )}

        {/* Video link */}
        {drill.video_search_query && (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleVideoClick}
          >
            <Play className="h-4 w-4 mr-2 fill-current" />
            Ver video demostrativo
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
