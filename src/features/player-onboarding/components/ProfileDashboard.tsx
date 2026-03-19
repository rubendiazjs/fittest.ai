import { useState } from 'react'
import { Flame, User, Dumbbell, Target, RefreshCw, ArrowLeft, LogOut, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  WarmUpLoading,
  WarmUpDisplay,
  WarmUpGuidedView,
  useGenerateWarmUp,
} from '@/features/warmup-generation'
import { useAuth } from '@/features/auth'
import { DeleteAccountDialog } from '@/features/auth/components'
import type { Tables } from '@/lib/database.types'

type PlayerProfile = Tables<'player_profiles'>

interface ProfileDashboardProps {
  profile: PlayerProfile
  onEditProfile?: () => void
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  pro: 'Profesional',
}

const FITNESS_LABELS: Record<string, string> = {
  low: 'Bajo',
  moderate: 'Moderado',
  good: 'Bueno',
  excellent: 'Excelente',
}

const YEARS_PLAYING_LABELS: Record<string, string> = {
  less_6_months: 'Menos de 6 meses',
  '6m_1y': '6 meses - 1 año',
  '1y_2y': '1-2 años',
  '2y_5y': '2-5 años',
  more_5y: 'Más de 5 años',
}

const FREQUENCY_LABELS: Record<string, string> = {
  occasional: 'Ocasional',
  weekly: '1-2 veces/semana',
  frequent: '3-4 veces/semana',
  daily: 'Casi a diario',
}

const TOURNAMENT_LABELS: Record<string, string> = {
  none: 'No compito',
  local: 'Torneos locales',
  federated: 'Torneos federados',
  professional: 'Profesional',
}

const GOAL_LABELS: Record<string, string> = {
  endurance: 'Resistencia',
  strength: 'Fuerza',
  weight_loss: 'Pérdida de peso',
  injury_prevention: 'Prevención de lesiones',
  peak_performance: 'Rendimiento máximo',
}

const INJURY_LABELS: Record<string, string> = {
  none: 'Sin lesiones',
  minor: 'Molestias menores',
  recovering: 'En recuperación',
  chronic: 'Lesión crónica',
}

export function ProfileDashboard({ profile, onEditProfile }: ProfileDashboardProps) {
  const { signOut } = useAuth()

  // Mutation hook - triggered by user click, not by mount
  const generateWarmUp = useGenerateWarmUp()

  // Guided view state
  const [showGuidedView, setShowGuidedView] = useState(false)

  // Delete account dialog state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // User clicks "Generate" → triggers mutation
  const handleGenerateWarmUp = () => {
    generateWarmUp.mutate(profile.id)
  }

  // User wants to go back to profile view
  const handleBackToProfile = () => {
    setShowGuidedView(false)
    generateWarmUp.reset()
  }

  // Start guided warm-up experience
  const handleStartGuided = () => {
    setShowGuidedView(true)
  }

  // Track video clicks (fire and forget)
  const handleVideoClick = (drillName: string, query: string) => {
    // TODO: Add proper analytics tracking here
    console.log('[Analytics] Video click:', { drillName, query, timestamp: new Date().toISOString() })
  }

  // Show loading state while generating
  if (generateWarmUp.isPending) {
    return (
      <div className="min-h-screen bg-background p-4">
        <WarmUpLoading />
      </div>
    )
  }

  // Show warm-up result
  if (generateWarmUp.data?.warmup) {
    // Guided view mode
    if (showGuidedView) {
      return (
        <div className="min-h-screen bg-background">
          <WarmUpGuidedView
            warmup={generateWarmUp.data.warmup}
            onComplete={() => setShowGuidedView(false)}
            onExit={() => setShowGuidedView(false)}
            onVideoClick={handleVideoClick}
          />
        </div>
      )
    }

    // Overview mode
    return (
      <div className="min-h-screen bg-background">
        <div className="p-4">
          <Button variant="ghost" onClick={handleBackToProfile} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al perfil
          </Button>
        </div>
        <div className="p-4">
          <WarmUpDisplay
            warmup={generateWarmUp.data.warmup}
            onContinue={handleBackToProfile}
            onRegenerate={handleGenerateWarmUp}
            isRegenerating={generateWarmUp.isPending}
            onStartGuided={handleStartGuided}
          />
        </div>
      </div>
    )
  }

  // Show error state
  if (generateWarmUp.error) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={handleBackToProfile} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al perfil
          </Button>
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Error al generar calentamiento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {generateWarmUp.error.message || 'No se pudo generar el calentamiento.'}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" onClick={handleGenerateWarmUp}>
                Reintentar
              </Button>
              <Button onClick={handleBackToProfile}>
                Volver al perfil
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  // Default: Show profile dashboard
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Tu Perfil de Jugador</h1>
          <p className="text-muted-foreground">Listo para entrenar</p>
        </div>

        {/* Profile Summary */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Game Experience */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Experiencia de Juego
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {LEVEL_LABELS[profile.game_experience_level] || profile.game_experience_level}
                </span>
                <span className="text-lg font-medium text-primary">
                  {profile.game_experience_score}/10
                </span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(profile.game_experience_score || 0) * 10}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Fitness Level */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Nivel Físico
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold">
                  {FITNESS_LABELS[profile.fitness_level] || profile.fitness_level}
                </span>
                <span className="text-lg font-medium text-primary">
                  {profile.fitness_score}/10
                </span>
              </div>
              <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(profile.fitness_score || 0) * 10}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              ¿Tienes partido hoy?
            </CardTitle>
            <CardDescription>
              Genera un calentamiento personalizado basado en tu perfil
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleGenerateWarmUp} className="w-full" size="lg">
              <Flame className="mr-2 h-5 w-5" />
              Generar Calentamiento Pre-Partido
            </Button>
          </CardFooter>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Años jugando:</span>
              <span className="font-medium">{YEARS_PLAYING_LABELS[profile.years_playing] || profile.years_playing}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Frecuencia:</span>
              <span className="font-medium">{FREQUENCY_LABELS[profile.frequency] || profile.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nivel de competición:</span>
              <span className="font-medium">{TOURNAMENT_LABELS[profile.tournament_level] || profile.tournament_level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Objetivo principal:</span>
              <span className="font-medium">{GOAL_LABELS[profile.primary_goal] || profile.primary_goal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estado de lesiones:</span>
              <span className="font-medium">{INJURY_LABELS[profile.injury_status] || profile.injury_status}</span>
            </div>
          </CardContent>
          <CardFooter>
            {onEditProfile && (
              <Button variant="outline" onClick={onEditProfile} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar Perfil
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Account Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={() => signOut()} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar cuenta
            </Button>
          </CardContent>
        </Card>

        <DeleteAccountDialog
          open={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
        />
      </div>
    </div>
  )
}
