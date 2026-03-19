import { Flame } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CheckinStreak } from '../types'

interface StreakIndicatorProps {
  streak: CheckinStreak | null
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  onClick?: () => void
}

export function StreakIndicator({
  streak,
  size = 'md',
  showLabel = true,
  onClick,
}: StreakIndicatorProps) {
  const currentStreak = streak?.currentStreak ?? 0

  const sizeClasses = {
    sm: 'text-sm gap-1',
    md: 'text-base gap-1.5',
    lg: 'text-lg gap-2',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  }

  const isActive = currentStreak > 0
  const isClickable = !!onClick

  const content = (
    <>
      <Flame
        className={cn(
          iconSizes[size],
          isActive && 'fill-orange-500 animate-pulse'
        )}
      />
      <span>{currentStreak}</span>
      {showLabel && (
        <span className="text-muted-foreground font-normal">
          {currentStreak === 1 ? 'día' : 'días'}
        </span>
      )}
    </>
  )

  if (isClickable) {
    return (
      <button
        onClick={onClick}
        className={cn(
          'inline-flex items-center font-medium rounded-full px-3 py-1.5',
          'hover:bg-orange-100 active:bg-orange-200 transition-colors',
          sizeClasses[size],
          isActive ? 'text-orange-500' : 'text-muted-foreground'
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <div
      className={cn(
        'inline-flex items-center font-medium',
        sizeClasses[size],
        isActive ? 'text-orange-500' : 'text-muted-foreground'
      )}
    >
      {content}
    </div>
  )
}
