import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface YesNoInputProps {
  value: string | null
  onChange: (value: string) => void
}

export function YesNoInput({ value, onChange }: YesNoInputProps) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange('yes')}
        className={cn(
          'flex-1 p-6 rounded-xl transition-all',
          'border-2 flex flex-col items-center gap-2',
          'hover:border-green-500/50',
          'active:scale-[0.98]',
          value === 'yes'
            ? 'border-green-500 bg-green-500/10'
            : 'border-border bg-background hover:bg-green-500/5'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            value === 'yes' ? 'bg-green-500 text-white' : 'bg-secondary'
          )}
        >
          <Check className="w-6 h-6" />
        </div>
        <span className="font-medium">Sí</span>
      </button>

      <button
        type="button"
        onClick={() => onChange('no')}
        className={cn(
          'flex-1 p-6 rounded-xl transition-all',
          'border-2 flex flex-col items-center gap-2',
          'hover:border-red-500/50',
          'active:scale-[0.98]',
          value === 'no'
            ? 'border-red-500 bg-red-500/10'
            : 'border-border bg-background hover:bg-red-500/5'
        )}
      >
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            value === 'no' ? 'bg-red-500 text-white' : 'bg-secondary'
          )}
        >
          <X className="w-6 h-6" />
        </div>
        <span className="font-medium">No</span>
      </button>
    </div>
  )
}
