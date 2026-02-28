import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { CheckinQuestion, CheckinStreak, CheckinResponseValue } from '../types'
import { StreakIndicator } from './StreakIndicator'
import { QuestionRenderer } from './QuestionRenderer'

interface CheckinModalProps {
  question: CheckinQuestion
  streak: CheckinStreak | null
  onSubmit: (value: CheckinResponseValue) => void
  onSkip: () => void
  onClose: () => void
  isSubmitting?: boolean
}

export function CheckinModal({
  question,
  streak,
  onSubmit,
  onSkip,
  onClose,
  isSubmitting = false,
}: CheckinModalProps) {
  const [value, setValue] = useState<CheckinResponseValue | null>(null)

  const hasValue = value !== null && (
    Array.isArray(value) ? value.length > 0 : true
  )

  const handleSubmit = () => {
    if (hasValue && value !== null) {
      onSubmit(value)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <StreakIndicator streak={streak} size="lg" />
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col h-[calc(100vh-73px)]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto space-y-6">
            {/* Question */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{question.titleEs}</h2>
              {question.subtitleEs && (
                <p className="text-muted-foreground">{question.subtitleEs}</p>
              )}
            </div>

            {/* Input */}
            <div className="py-4">
              <QuestionRenderer
                question={question}
                value={value}
                onChange={setValue}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t bg-background">
          <div className="max-w-lg mx-auto space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={!hasValue || isSubmitting}
              className={cn(
                'w-full h-12 text-lg',
                hasValue && 'animate-pulse'
              )}
            >
              {isSubmitting ? 'Guardando...' : 'Responder'}
            </Button>
            <Button
              variant="ghost"
              onClick={onSkip}
              disabled={isSubmitting}
              className="w-full text-muted-foreground"
            >
              Saltar por hoy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
