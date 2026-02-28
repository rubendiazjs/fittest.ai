import { useState } from 'react'

interface TextInputProps {
  value: string | null
  onChange: (value: string) => void
  placeholder?: string
  maxLength?: number
}

export function TextInput({
  value,
  onChange,
  placeholder = 'Escribe tu respuesta...',
  maxLength = 500,
}: TextInputProps) {
  const [localValue, setLocalValue] = useState(value ?? '')

  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      setLocalValue(newValue)
      onChange(newValue)
    }
  }

  return (
    <div className="space-y-2">
      <textarea
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] p-4 rounded-lg border-2 border-border bg-background resize-none focus:border-primary focus:outline-none transition-colors"
        maxLength={maxLength}
      />
      <p className="text-xs text-muted-foreground text-right">
        {localValue.length}/{maxLength}
      </p>
    </div>
  )
}
