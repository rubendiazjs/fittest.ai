import { useEffect, useCallback, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { OptionCard } from './OptionCard'
import type { Question } from './questions'

interface QuestionViewProps {
  question: Question
  currentIndex: number
  totalQuestions: number
  value: string | string[] | undefined
  onChange: (value: string | string[]) => void
  onNext: () => void
  onBack: () => void
  canGoBack: boolean
}

export function QuestionView({
  question,
  currentIndex,
  totalQuestions,
  value,
  onChange,
  onNext,
  onBack,
  canGoBack,
}: QuestionViewProps) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const isMulti = question.type === 'multi'
  const selectedValues = useMemo(
    () => (isMulti ? ((value as string[] | undefined) ?? []) : []),
    [isMulti, value]
  )
  const selectedValue = !isMulti ? (value as string) : undefined

  const handleSelect = useCallback((optionValue: string) => {
    if (isMulti) {
      const current = selectedValues
      if (current.includes(optionValue)) {
        onChange(current.filter(v => v !== optionValue))
      } else {
        onChange([...current, optionValue])
      }
    } else {
      onChange(optionValue)
      // Auto-advance for single choice after a brief delay
      setTimeout(() => onNext(), 300)
    }
  }, [isMulti, selectedValues, onChange, onNext])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Number keys for quick selection
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1
        if (index < question.options.length) {
          handleSelect(question.options[index].value)
        }
      }
      // Letter keys A-Z for quick selection
      if (e.key.length === 1 && e.key >= 'a' && e.key <= 'z') {
        const index = e.key.charCodeAt(0) - 97 // 'a' = 0, 'b' = 1, etc.
        if (index < question.options.length) {
          handleSelect(question.options[index].value)
        }
      }
      // Enter to continue (for multi-select)
      if (e.key === 'Enter' && isMulti) {
        onNext()
      }
      // Arrow up/down for navigation
      if (e.key === 'ArrowUp' && canGoBack) {
        onBack()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [question.options, handleSelect, isMulti, onNext, onBack, canGoBack])

  const getShortcut = (index: number) => {
    return String.fromCharCode(65 + index) // A, B, C, D...
  }

  const hasSelection = isMulti ? selectedValues.length > 0 : !!selectedValue

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Progress value={progress} className="h-1 rounded-none" />
      </div>

      {/* Navigation */}
      <div className="fixed top-4 right-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={onBack}
          disabled={!canGoBack}
          className="h-10 w-10"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          disabled={!hasSelection}
          className="h-10 w-10"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      {/* Question counter */}
      <div className="fixed top-4 left-4 text-sm text-muted-foreground z-10">
        {currentIndex + 1} / {totalQuestions}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-xl space-y-8">
          {/* Question */}
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {question.title}
            </h1>
            {question.subtitle && (
              <p className="text-muted-foreground">
                {question.subtitle}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <OptionCard
                key={option.value}
                label={option.label}
                description={option.description}
                shortcut={getShortcut(index)}
                selected={
                  isMulti
                    ? selectedValues.includes(option.value)
                    : selectedValue === option.value
                }
                onClick={() => handleSelect(option.value)}
              />
            ))}
          </div>

          {/* Continue button for multi-select */}
          {isMulti && (
            <div className="pt-4">
              <Button
                onClick={onNext}
                disabled={!hasSelection}
                className="w-full sm:w-auto"
                size="lg"
              >
                Continuar
                <span className="ml-2 text-xs opacity-70">Enter ↵</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
        Presiona <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">A</kbd>-<kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">{getShortcut(question.options.length - 1)}</kbd> para seleccionar
        {isMulti && (
          <span className="ml-2">
            • <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Enter</kbd> para continuar
          </span>
        )}
      </div>
    </div>
  )
}
