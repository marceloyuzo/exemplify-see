import { Dispatch, SetStateAction, useEffect } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { InputAnimated } from '../ui/input-animated'
import { DialogDescription } from '@radix-ui/react-dialog'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Step } from '../question/question-dialog'
import { TextareaAnimated } from '../ui/text-area-animated'

interface StepDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  steps: Step[]
  setSteps: Dispatch<SetStateAction<Step[]>>
  step: Step | null
}

const addStepSchema = z.object({
  title: z.string().min(1, 'Título do passo é obrigatório'),
  description: z.string().min(1, 'Descrição do passo é obrigatória'),
})

type AddStepSchema = z.infer<typeof addStepSchema>

export default function StepDialog({
  open,
  setOpen,
  setSteps,
  step,
  steps,
}: StepDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddStepSchema>({
    resolver: zodResolver(addStepSchema),
  })

  useEffect(() => {
    reset({
      title: step?.title || '',
      description: step?.description || '',
    })
  }, [step, reset])

  function handleSaveStep({ description, title }: AddStepSchema) {
    if (step) {
      setSteps((prev) =>
        prev.map((s) => (s.id === step.id ? { ...s, title, description } : s)),
      )
    } else {
      const newStep = {
        id: crypto.randomUUID(),
        title,
        description,
        order: steps.length,
      }
      setSteps((prev) => [...prev, newStep])
    }

    reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{step ? 'Editar passo' : 'Adicionar passo'}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleSubmit(handleSaveStep)(e)
          }}
          id="step-form"
        >
          <InputAnimated
            label="Título do passo"
            {...register('title')}
            error={errors.title}
          />
          <TextareaAnimated
            label="Descrição do passo"
            {...register('description')}
            error={errors.description}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" form="step-form" formTarget="step-form">
              Salvar passo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
