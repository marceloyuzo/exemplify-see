import { useId } from 'react'
import { FieldError } from 'react-hook-form'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface CheckboxWithLabelProps {
  label: string
  sublabel?: string
  description?: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  error?: FieldError
}

export function CheckboxWithLabel({
  label,
  sublabel,
  description,
  checked,
  onCheckedChange,
  error,
}: CheckboxWithLabelProps) {
  const id = useId()

  return (
    <div className="flex items-start gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-describedby={description ? `${id}-description` : undefined}
      />
      <div className="grid grow gap-1">
        <Label htmlFor={id}>
          {label}{' '}
          {sublabel && (
            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
              ({sublabel})
            </span>
          )}
        </Label>

        {description && (
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
            {description}
          </p>
        )}

        {error && (
          <span className="text-xs text-red-500 mt-1">{error.message}</span>
        )}
      </div>
    </div>
  )
}
