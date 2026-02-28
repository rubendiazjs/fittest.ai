import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface WelcomeStepProps {
  onStart: () => void
}

export function WelcomeStep({ onStart }: WelcomeStepProps) {
  // Enter to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        onStart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onStart])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-xl text-center space-y-8">
        {/* Logo/Brand */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Fittest.ai
          </h1>
          <p className="text-xl text-muted-foreground">
            Tu entrenador personal de pádel
          </p>
        </div>

        {/* Intro text */}
        <div className="space-y-4 text-lg text-muted-foreground">
          <p>
            Vamos a conocerte para crear sesiones de entrenamiento
            <strong className="text-foreground"> personalizadas</strong> para ti.
          </p>
          <p className="text-base">
            Solo son 15 preguntas. Te tomará unos 3 minutos.
          </p>
        </div>

        {/* What we'll cover */}
        <div className="flex justify-center gap-8 text-sm text-muted-foreground py-4">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-primary font-medium">1</span>
            </div>
            <span>Tu nivel</span>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-primary font-medium">2</span>
            </div>
            <span>Tu físico</span>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-primary font-medium">3</span>
            </div>
            <span>Tu vida</span>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4">
          <Button size="lg" onClick={onStart} className="text-lg px-8 py-6">
            Empezar
          </Button>
          <p className="text-xs text-muted-foreground mt-4">
            o presiona <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Enter</kbd>
          </p>
        </div>
      </div>
    </div>
  )
}
