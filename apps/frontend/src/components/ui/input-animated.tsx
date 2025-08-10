import { Input } from '@/components/ui/input'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface InputAnimatedProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: FieldError
  register?: UseFormRegisterReturn
}

export function InputAnimated({
  label,
  error,
  register,
  ...props
}: InputAnimatedProps) {
  return (
    <div className="group relative">
      <label
        className="
          origin-start text-muted-foreground/70
          group-focus-within:text-foreground
          has-[+input:not(:placeholder-shown)]:text-foreground
          absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm transition-all
          group-focus-within:pointer-events-none
          group-focus-within:top-0
          group-focus-within:cursor-default
          group-focus-within:text-xs
          group-focus-within:font-medium
          has-[+input:not(:placeholder-shown)]:pointer-events-none
          has-[+input:not(:placeholder-shown)]:top-0
          has-[+input:not(:placeholder-shown)]:cursor-default
          has-[+input:not(:placeholder-shown)]:text-xs
          has-[+input:not(:placeholder-shown)]:font-medium
        "
      >
        <span className="inline-flex px-2">{label}</span>
      </label>

      <Input placeholder=" " {...register} {...props} />

      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  )
}
