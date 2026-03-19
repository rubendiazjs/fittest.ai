import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface OptionCardProps {
  label: string
  description?: string
  selected: boolean
  onClick: () => void
  shortcut?: string
}

export function OptionCard({ label, description, selected, onClick, shortcut }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border-2 transition-all duration-200',
        'hover:border-primary hover:bg-primary/5',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card'
      )}
    >
      <div className="flex items-center gap-3">
        {shortcut && (
          <span className={cn(
            'flex-shrink-0 w-7 h-7 rounded flex items-center justify-center text-sm font-medium border',
            selected
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-muted text-muted-foreground border-border'
          )}>
            {shortcut}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-medium">{label}</div>
          {description && (
            <div className="text-sm text-muted-foreground mt-0.5">{description}</div>
          )}
        </div>
        {selected && (
          <Check className="flex-shrink-0 w-5 h-5 text-primary" />
        )}
      </div>
    </button>
  )
}
