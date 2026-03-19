import { cn } from '@/lib/utils'
import type { CheckinOption } from '../../types'

interface SingleSelectProps {
  options: CheckinOption[]
  value: string | null
  onChange: (value: string) => void
}

export function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'w-full p-4 rounded-lg text-left transition-all',
            'border-2',
            'hover:border-primary/50',
            'active:scale-[0.98]',
            value === option.value
              ? 'border-primary bg-primary/10'
              : 'border-border bg-background hover:bg-secondary/50'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                value === option.value
                  ? 'border-primary bg-primary'
                  : 'border-muted-foreground'
              )}
            >
              {value === option.value && (
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{option.label}</p>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
