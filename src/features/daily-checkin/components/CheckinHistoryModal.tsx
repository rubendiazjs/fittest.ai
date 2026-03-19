import { useState } from 'react'
import { X, Flame, Calendar, Edit2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CheckinStreak, CheckinQuestion, CheckinResponseValue } from '../types'
import type { CheckinHistoryItem } from '../hooks/useCheckinHistory'
import { QuestionRenderer } from './QuestionRenderer'

interface CheckinHistoryModalProps {
  streak: CheckinStreak | null
  history: CheckinHistoryItem[]
  isLoading: boolean
  todayQuestion: CheckinQuestion | null
  onClose: () => void
  onEditToday: (value: CheckinResponseValue) => void
  isSubmitting?: boolean
}

// Format response value for display
function formatResponseValue(
  value: unknown,
  inputType: string,
  skipped: boolean
): string {
  if (skipped) return 'Saltada'

  switch (inputType) {
    case 'slider':
      return `${value}/10`
    case 'single_select':
    case 'yes_no':
      return formatSelectValue(value as string)
    case 'multi_select':
    case 'body_map': {
      const arr = value as string[]
      if (!arr?.length) return 'Ninguno'
      return arr.map(formatSelectValue).join(', ')
    }
    case 'text':
      return (value as string) || 'Sin respuesta'
    default:
      return String(value)
  }
}

// Format select values to be more readable
function formatSelectValue(value: string): string {
  // Convert snake_case to readable text
  const labels: Record<string, string> = {
    // Sleep quality
    muy_bien: 'Muy bien',
    bien: 'Bien',
    regular: 'Regular',
    mal: 'Mal',
    muy_mal: 'Muy mal',
    // Recovery
    fully_recovered: 'Totalmente recuperado',
    mostly_recovered: 'Casi recuperado',
    somewhat_tired: 'Algo cansado',
    very_tired: 'Muy cansado',
    // Yes/No
    yes: 'Sí',
    no: 'No',
    // Body zones
    shoulder_left: 'Hombro izq.',
    shoulder_right: 'Hombro der.',
    elbow_left: 'Codo izq.',
    elbow_right: 'Codo der.',
    wrist_left: 'Muñeca izq.',
    wrist_right: 'Muñeca der.',
    lower_back: 'Espalda baja',
    knee_left: 'Rodilla izq.',
    knee_right: 'Rodilla der.',
    ankle_left: 'Tobillo izq.',
    ankle_right: 'Tobillo der.',
    hip_left: 'Cadera izq.',
    hip_right: 'Cadera der.',
    // Shots
    drive: 'Drive',
    reves: 'Revés',
    volea: 'Volea',
    bandeja: 'Bandeja',
    vibora: 'Víbora',
    smash: 'Smash',
    globo: 'Globo',
    saque: 'Saque',
  }
  return labels[value] || value.replace(/_/g, ' ')
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)

  const dateOnly = dateStr.split('T')[0]
  const todayOnly = today.toISOString().split('T')[0]
  const yesterdayOnly = yesterday.toISOString().split('T')[0]

  if (dateOnly === todayOnly) return 'Hoy'
  if (dateOnly === yesterdayOnly) return 'Ayer'

  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

// Check if a date is today
function isToday(dateStr: string): boolean {
  const today = new Date().toISOString().split('T')[0]
  return dateStr === today
}

export function CheckinHistoryModal({
  streak,
  history,
  isLoading,
  todayQuestion,
  onClose,
  onEditToday,
  isSubmitting = false,
}: CheckinHistoryModalProps) {
  const [editingToday, setEditingToday] = useState(false)
  const [editValue, setEditValue] = useState<CheckinResponseValue | null>(null)

  const todayResponse = history.find((item) => isToday(item.responseDate))

  const handleStartEdit = () => {
    if (todayResponse) {
      setEditValue(todayResponse.responseValue as CheckinResponseValue)
    }
    setEditingToday(true)
  }

  const handleSaveEdit = () => {
    if (editValue !== null) {
      onEditToday(editValue)
      setEditingToday(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingToday(false)
    setEditValue(null)
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Tu progreso</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto h-[calc(100vh-65px)]">
        {/* Streak Stats */}
        <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-b">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame
              className={cn(
                'h-12 w-12',
                streak?.currentStreak ? 'text-orange-500 fill-orange-500' : 'text-gray-300'
              )}
            />
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600">
                {streak?.currentStreak ?? 0}
              </div>
              <div className="text-sm text-muted-foreground">
                {streak?.currentStreak === 1 ? 'día seguido' : 'días seguidos'}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl font-semibold">{streak?.longestStreak ?? 0}</div>
              <div className="text-xs text-muted-foreground">Racha más larga</div>
            </div>
            <div className="bg-white/60 rounded-lg p-3">
              <div className="text-2xl font-semibold">{streak?.totalCheckins ?? 0}</div>
              <div className="text-xs text-muted-foreground">Check-ins totales</div>
            </div>
          </div>
        </div>

        {/* Edit Today Section */}
        {editingToday && todayQuestion && (
          <div className="p-4 border-b bg-blue-50">
            <h3 className="font-medium mb-3">Editar respuesta de hoy</h3>
            <p className="text-sm text-muted-foreground mb-4">{todayQuestion.titleEs}</p>

            <QuestionRenderer
              question={todayQuestion}
              value={editValue}
              onChange={setEditValue}
            />

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isSubmitting || editValue === null}
                className="flex-1"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </div>
        )}

        {/* History List */}
        <div className="p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Historial reciente
          </h3>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Cargando historial...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aún no tienes check-ins registrados
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => {
                const isTodayItem = isToday(item.responseDate)
                const canEdit = isTodayItem && !editingToday && todayQuestion

                return (
                  <div
                    key={item.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      isTodayItem ? 'bg-blue-50 border-blue-200' : 'bg-white'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {formatDate(item.responseDate)}
                          </span>
                          {isTodayItem && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              Hoy
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium truncate">{item.questionTitle}</p>
                        <p
                          className={cn(
                            'text-sm mt-0.5',
                            item.skipped ? 'text-muted-foreground italic' : 'text-foreground'
                          )}
                        >
                          {formatResponseValue(item.responseValue, item.inputType, item.skipped)}
                        </p>
                      </div>

                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleStartEdit}
                          className="shrink-0"
                        >
                          <Edit2 className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
