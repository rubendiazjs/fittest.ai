import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { CheckinOption } from '../../types'

interface MultiSelectProps {
  options: CheckinOption[]
  value: string[]
  onChange: (value: string[]) => void
  maxSelections?: number
}

export function MultiSelect({
  options,
  value,
  onChange,
  maxSelections,
}: MultiSelectProps) {
  const handleToggle = (optionValue: string) => {
    const isSelected = value.includes(optionValue)

    if (isSelected) {
      onChange(value.filter((v) => v !== optionValue))
    } else {
      if (maxSelections && value.length >= maxSelections) {
        // Replace oldest selection
        onChange([...value.slice(1), optionValue])
      } else {
        onChange([...value, optionValue])
      }
    }
  }

  return (
    <div className="space-y-2">
      {maxSelections && (
        <p className="text-xs text-muted-foreground mb-3">
          Selecciona hasta {maxSelections} opciones
        </p>
      )}
      {options.map((option) => {
        const isSelected = value.includes(option.value)
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={cn(
              'w-full p-4 rounded-lg text-left transition-all',
              'border-2',
              'hover:border-primary/50',
              'active:scale-[0.98]',
              isSelected
                ? 'border-primary bg-primary/10'
                : 'border-border bg-background hover:bg-secondary/50'
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center shrink-0',
                  isSelected
                    ? 'border-primary bg-primary'
                    : 'border-muted-foreground'
                )}
              >
                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
              </div>
              <div>
                <p className="font-medium">{option.label}</p>
                {option.description && (
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
