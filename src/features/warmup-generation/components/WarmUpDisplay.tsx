import { Clock, CheckCircle2, AlertTriangle, Thermometer, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { PhaseCard } from './PhaseCard'
import type { WarmUp } from '../types'

interface WarmUpDisplayProps {
  warmup: WarmUp
  onContinue?: () => void
  onRegenerate?: () => void
  isRegenerating?: boolean
  onStartGuided?: () => void
}

export function WarmUpDisplay({
  warmup,
  onContinue,
  onRegenerate,
  isRegenerating,
  onStartGuided,
}: WarmUpDisplayProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <Card>
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-2">
            <span className="text-4xl">🔥</span>
          </div>
          <CardTitle className="text-2xl">{warmup.title}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4" />
            {warmup.duration_minutes} minutos
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Start Guided Warm-Up Button */}
      {onStartGuided && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="pt-6">
            <Button
              onClick={onStartGuided}
              className="w-full"
              size="lg"
            >
              <Play className="h-5 w-5 mr-2" />
              Comenzar calentamiento guiado
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Sigue cada ejercicio paso a paso con temporizador
            </p>
          </CardContent>
        </Card>
      )}

      {/* RAMP Phases */}
      <div className="space-y-4">
        {warmup.phases.map((phase, index) => (
          <PhaseCard key={index} phase={phase} />
        ))}
      </div>

      {/* Ready to Play Checklist */}
      {warmup.ready_checklist && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              ¿Listo para jugar? Comprueba...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Señales físicas:</p>
              <ul className="space-y-1">
                {warmup.ready_checklist.physical_signs.map((sign, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-600 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">Señales neurológicas:</p>
              <ul className="space-y-1">
                {warmup.ready_checklist.neurological_signs.map((sign, index) => (
                  <li key={index} className="flex items-start gap-2 text-green-600 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adaptations */}
      {warmup.adaptations && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
              <AlertTriangle className="h-5 w-5" />
              Adaptaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Thermometer className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700">Si hace frío:</p>
                <p className="text-sm text-amber-600">{warmup.adaptations.cold_conditions}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-700">Si hay molestias:</p>
                <p className="text-sm text-amber-600">{warmup.adaptations.if_irritated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardFooter className="flex justify-between pt-6">
          {onRegenerate && (
            <Button
              variant="outline"
              onClick={onRegenerate}
              disabled={isRegenerating}
            >
              Regenerar
            </Button>
          )}
          {onContinue && (
            <Button onClick={onContinue} className="ml-auto">
              ¡A jugar!
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
