'use client'

import { useId } from 'react'
import { X } from 'lucide-react'
import { Label } from '@/components/ui/label'
import MultipleSelector, { Option } from '@/components/ui/multiselect'

interface MultiSelectOverlappingProps {
  label: string
  placeholder?: string
  options?: Option[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  error?: string
  className?: string
  clearable?: boolean
  onClear?: () => void
  disabled?: boolean
}

export function MultiSelectOverlapping({
  label,
  placeholder = 'Selecione uma opção',
  options = [],
  value = [],
  onValueChange,
  error,
  className = '',
  clearable = false,
  onClear,
  disabled = false,
}: MultiSelectOverlappingProps) {
  const id = useId()

  const selectedOptions = value
    .map((val) => options.find((o) => o.value === val))
    .filter(Boolean) as Option[]

  const handleChange = (opts: Option[]) => {
    onValueChange?.(opts.map((o) => o.value))
  }

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onClear) onClear()
    else onValueChange?.([])
  }

  return (
    <div className={`group relative ${className}`}>
      <Label
        htmlFor={id}
        className="bg-background text-foreground absolute start-1 top-0 z-10 block -translate-y-1/2 px-2 text-xs font-medium group-has-disabled:opacity-50"
      >
        {label}
      </Label>

      <div className="relative">
        <MultipleSelector
          value={selectedOptions}
          onChange={handleChange}
          defaultOptions={options}
          placeholder={placeholder}
          disabled={disabled}
          hideClearAllButton
          hidePlaceholderWhenSelected
          emptyIndicator={
            <p className="text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado
            </p>
          }
          commandProps={{
            label: placeholder,
          }}
        />

        {clearable && value.length > 0 && (
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
        <span className="text-xs text-red-500 mt-1 block">{error}</span>
      )}
    </div>
  )
}
