import { Clock, AlertCircle, Play } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PHASE_COLORS, getIntensityColor, buildYouTubeSearchUrl, type WarmUpPhase } from '../types'

interface PhaseCardProps {
  phase: WarmUpPhase
}

export function PhaseCard({ phase }: PhaseCardProps) {
  const colorClasses = PHASE_COLORS[phase.phase] || 'bg-gray-100 text-gray-800 border-gray-200'

  return (
    <Card className={`border-l-4 ${colorClasses.split(' ').find(c => c.startsWith('border-'))}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {phase.phase_label}
          </CardTitle>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {phase.timestamp}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {phase.drills.map((drill, index) => (
          <div key={index} className="space-y-2 pb-3 border-b last:border-b-0 last:pb-0">
            {/* Drill header */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium">{drill.name}</h4>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">{drill.duration}</span>
                <span className={`text-xs font-medium ${getIntensityColor(drill.intensity)}`}>
                  RPE {drill.intensity}
                </span>
              </div>
            </div>

            {/* Coaching cues */}
            <ul className="text-sm text-muted-foreground space-y-0.5">
              {drill.coaching_cues.map((cue, cueIndex) => (
                <li key={cueIndex} className="flex items-start gap-1.5">
                  <span className="text-primary mt-0.5">→</span>
                  {cue}
                </li>
              ))}
            </ul>

            {/* Common mistake */}
            <div className="flex items-start gap-1.5 text-xs text-orange-600 bg-orange-50 rounded px-2 py-1">
              <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
              <span><strong>Evitar:</strong> {drill.common_mistake}</span>
            </div>

            {/* Video link */}
            {drill.video_search_query && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                asChild
              >
                <a
                  href={buildYouTubeSearchUrl(drill.video_search_query)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="h-4 w-4 mr-2 fill-current" />
                  Ver video demostrativo
                </a>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
