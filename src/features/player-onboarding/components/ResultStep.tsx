import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { useAuth } from '@/features/auth'
import { useCreatePlayerProfile } from '../hooks/useCreatePlayerProfile'
import { calculateGameExperience, calculateFitness } from '../utils/classification'
import type { OnboardingFormData, GameExperienceLevel, FitnessLevel } from '../types'

interface ResultStepProps {
  data: OnboardingFormData
  onBack: () => void
  onProfileSaved?: () => void
}

const LEVEL_LABELS: Record<GameExperienceLevel, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
  pro: 'Profesional',
}

const FITNESS_LABELS: Record<FitnessLevel, string> = {
  low: 'Bajo',
  moderate: 'Moderado',
  good: 'Bueno',
  excellent: 'Excelente',
}

const MOTIVATION_LABELS: Record<string, string> = {
  fun: 'Diversión y social',
  health: 'Salud y fitness',
  improvement: 'Mejora continua',
  competition: 'Competición',
}

export function ResultStep({ data, onBack, onProfileSaved }: ResultStepProps) {
  const { user } = useAuth()
  const createProfile = useCreatePlayerProfile()

  const gameExp = calculateGameExperience(data.gameExperience)
  const fitness = calculateFitness(data.fitness)

  const handleComplete = () => {
    // Build the profile insert object matching our database schema
    createProfile.mutate(
      {
        user_id: user!.id,
        // Game Experience
        game_experience_level: gameExp.level,
        game_experience_score: Math.round(gameExp.score),
        years_playing: data.gameExperience?.yearsPlaying || 'less_6_months',
        frequency: data.gameExperience?.frequency || 'occasional',
        tournament_level: data.gameExperience?.tournamentLevel || 'none',
        skills: data.gameExperience?.skills || [],
        // Fitness
        fitness_level: fitness.level,
        fitness_score: Math.round(fitness.score),
        activity_level: data.fitness?.activityLevel || 'sedentary',
        endurance: data.fitness?.endurance || 'fair',
        injury_status: data.fitness?.injuryStatus || 'none',
        primary_goal: data.fitness?.primaryGoal || 'endurance',
        // Lifestyle
        motivation: data.lifestyle?.motivation || 'fun',
        weekly_hours: data.lifestyle?.weeklyHours || 'minimal',
        preferred_time: data.lifestyle?.preferredTime || 'flexible',
        sleep_quality: data.lifestyle?.sleepQuality || 'fair',
        life_context: data.lifestyle?.lifeContext || 'flexible',
      },
      {
        onSuccess: () => {
          // Notify parent that profile was saved
          // Parent will invalidate query → App shows ProfileDashboard
          onProfileSaved?.()
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Tu Perfil de Jugador</CardTitle>
        <CardDescription>Basado en tus respuestas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Experience */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Experiencia de Juego</span>
            <span className="text-lg font-bold text-primary">{gameExp.score}/10</span>
          </div>
          <div className="text-2xl font-bold">{LEVEL_LABELS[gameExp.level]}</div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${gameExp.score * 10}%` }}
            />
          </div>
        </div>

        {/* Fitness */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Nivel Físico</span>
            <span className="text-lg font-bold text-primary">{fitness.score}/10</span>
          </div>
          <div className="text-2xl font-bold">{FITNESS_LABELS[fitness.level]}</div>
          <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${fitness.score * 10}%` }}
            />
          </div>
        </div>

        {/* Lifestyle summary */}
        <div className="bg-secondary/50 rounded-lg p-4">
          <span className="font-medium">Tu Estilo de Vida</span>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Motivación:</span>
              <span className="font-medium">{MOTIVATION_LABELS[data.lifestyle?.motivation || 'fun']}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tiempo disponible:</span>
              <span className="font-medium">
                {data.lifestyle?.weeklyHours === 'minimal' && 'Menos de 1h/semana'}
                {data.lifestyle?.weeklyHours === 'light' && '1-2h/semana'}
                {data.lifestyle?.weeklyHours === 'moderate' && '3-4h/semana'}
                {data.lifestyle?.weeklyHours === 'dedicated' && '5+ h/semana'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horario preferido:</span>
              <span className="font-medium">
                {data.lifestyle?.preferredTime === 'morning' && 'Mañanas'}
                {data.lifestyle?.preferredTime === 'midday' && 'Mediodía'}
                {data.lifestyle?.preferredTime === 'evening' && 'Tardes'}
                {data.lifestyle?.preferredTime === 'weekend' && 'Fines de semana'}
                {data.lifestyle?.preferredTime === 'flexible' && 'Flexible'}
              </span>
            </div>
          </div>
        </div>

        {/* Recommendation preview */}
        <div className="border rounded-lg p-4">
          <span className="font-medium text-primary">Recomendación</span>
          <p className="mt-2 text-sm text-muted-foreground">
            {data.lifestyle?.weeklyHours === 'minimal' || data.lifestyle?.weeklyHours === 'light'
              ? 'Te recomendamos 1-2 sesiones cortas y eficientes por semana.'
              : 'Te recomendamos 2-3 sesiones de 45-60 minutos por semana.'}
            {' '}
            {data.lifestyle?.motivation === 'competition'
              ? 'Incluiremos trabajo periodizado enfocado en rendimiento.'
              : 'Variaremos los ejercicios para mantener la motivación.'}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        {/* Error display */}
        {createProfile.error && (
          <div className="w-full p-3 text-sm text-destructive bg-destructive/10 rounded-md">
            {createProfile.error.message || 'Error al guardar el perfil'}
          </div>
        )}

        <div className="flex w-full justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={createProfile.isPending}
          >
            Ajustar respuestas
          </Button>
          <Button
            onClick={handleComplete}
            disabled={createProfile.isPending}
          >
            {createProfile.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {createProfile.isPending ? 'Guardando...' : 'Empezar a entrenar'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
