import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { SliderConfig } from '../../types'

interface SliderInputProps {
  config: SliderConfig
  value: number | null
  onChange: (value: number) => void
}

const EMOJI_LABELS: Record<number, string> = {
  1: '😴',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
  6: '😃',
  7: '💪',
  8: '🔥',
  9: '⚡',
  10: '🚀',
}

export function SliderInput({ config, value, onChange }: SliderInputProps) {
  const [localValue, setLocalValue] = useState<number>(
    value ?? Math.floor((config.min + config.max) / 2)
  )

  const handleChange = (newValue: number) => {
    setLocalValue(newValue)
    onChange(newValue)
  }

  const steps = Array.from(
    { length: config.max - config.min + 1 },
    (_, i) => config.min + i
  )

  return (
    <div className="space-y-4">
      {/* Visual slider with buttons */}
      <div className="flex justify-between gap-1">
        {steps.map((step) => (
          <button
            key={step}
            type="button"
            onClick={() => handleChange(step)}
            className={cn(
              'flex-1 py-3 rounded-lg text-lg font-medium transition-all',
              'hover:scale-105 active:scale-95',
              localValue === step
                ? 'bg-primary text-primary-foreground shadow-lg'
                : 'bg-secondary hover:bg-secondary/80'
            )}
          >
            {step}
          </button>
        ))}
      </div>

      {/* Emoji indicator */}
      <div className="text-center">
        <span className="text-4xl" role="img" aria-label={`Level ${localValue}`}>
          {EMOJI_LABELS[localValue] || '😊'}
        </span>
        {config.labels && config.labels[String(localValue)] && (
          <p className="text-sm text-muted-foreground mt-1">
            {config.labels[String(localValue)]}
          </p>
        )}
      </div>
    </div>
  )
}
