import { useId } from 'react'
import { FieldError } from 'react-hook-form'
import { X } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface SelectOverlappingProps {
  label: string
  placeholder?: string
  options: { value: string; label: string }[]
  value?: string
  onValueChange?: (value: string) => void
  error?: FieldError
  className?: string
  clearable?: boolean
  onClear?: () => void
}

export function SelectOverlapping({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
  className = '',
  clearable = false,
  onClear,
}: SelectOverlappingProps) {
  const id = useId()

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClear) {
      onClear()
    } else if (onValueChange) {
      onValueChange('')
    }
  }

  return (
    <div className={`group relative ${className}`}>
      <label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        {label}
      </label>
      <div className="relative">
        <Select value={value} onValueChange={onValueChange}>
          <SelectTrigger
            id={id}
            className={`bg-card cursor-pointer truncate ${clearable && value ? 'pr-8' : ''}`}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-card">
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="cursor-pointer"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {clearable && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-sm transition-colors z-20"
            aria-label="Limpar seleção"
          >
            <X size={14} />
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  )
}
