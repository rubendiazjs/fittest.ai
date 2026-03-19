import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const LOADING_MESSAGES = [
  'Analizando tu perfil...',
  'Preparando ejercicios personalizados...',
  'Adaptando intensidad a tu nivel...',
  'Generando calentamiento...',
]

export function WarmUpLoading() {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-12 pb-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">
              Generando tu calentamiento personalizado
            </h3>
            <p className="text-sm text-muted-foreground">
              Nuestro entrenador AI está creando una rutina adaptada a tu nivel
              y condición física...
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 max-w-xs">
            {LOADING_MESSAGES.map((message, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground animate-pulse"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {message}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
