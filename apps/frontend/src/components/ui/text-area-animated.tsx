import { Textarea } from '@/components/ui/textarea'
import { FieldError, UseFormRegisterReturn } from 'react-hook-form'

interface TextareaAnimatedProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: FieldError
  register?: UseFormRegisterReturn
}

export function TextareaAnimated({
  label,
  error,
  register,
  ...props
}: TextareaAnimatedProps) {
  const id = props.id || label.replace(/\s+/g, '-').toLowerCase()

  return (
    <div className="group relative flex flex-col">
      <div className="relative">
        <label
          htmlFor={id}
          className="
            origin-start text-muted-foreground/70
            group-focus-within:text-foreground
            has-[+textarea:not(:placeholder-shown)]:text-foreground
            absolute left-0 top-3
            block cursor-text px-1 text-sm transition-all
            group-focus-within:pointer-events-none
            group-focus-within:top-0
            group-focus-within:-translate-y-1/2
            group-focus-within:cursor-default
            group-focus-within:text-xs
            group-focus-within:font-medium
            has-[+textarea:not(:placeholder-shown)]:pointer-events-none
            has-[+textarea:not(:placeholder-shown)]:top-0
            has-[+textarea:not(:placeholder-shown)]:-translate-y-1/2
            has-[+textarea:not(:placeholder-shown)]:cursor-default
            has-[+textarea:not(:placeholder-shown)]:text-xs
            has-[+textarea:not(:placeholder-shown)]:font-medium
          "
        >
          <span className="inline-flex px-2">{label}</span>
        </label>

        <Textarea id={id} placeholder=" " {...register} {...props} />
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1">{error.message}</span>
      )}
    </div>
  )
}
