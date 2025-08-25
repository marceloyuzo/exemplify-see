import z from 'zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { InputAnimated } from '../ui/input-animated'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { Model } from '@/app/painel-administrador/modelos/page'
import { createModel, CreateModelBody } from '@/api/models/create-model'
import { updateModel, UpdateModelBody } from '@/api/models/update-model'

const modelSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

type ModelSchema = z.infer<typeof modelSchema>

interface ModelDialogProps {
  model?: Model | null
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ModelDialog({
  model,
  open,
  setOpen,
}: ModelDialogProps) {
  const { register, handleSubmit, reset } = useForm<ModelSchema>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      title: model?.title ?? '',
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: create } = useMutation({
    mutationFn: ({ title }: CreateModelBody) => createModel({ title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })

  const { mutateAsync: update } = useMutation({
    mutationFn: ({ modelId, title }: UpdateModelBody) =>
      updateModel({ modelId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] })
    },
  })

  useEffect(() => {
    if (model) {
      reset({ title: model.title })
    } else {
      reset({ title: '' })
    }
  }, [model, reset, open])

  async function handleSubmitForm(data: ModelSchema) {
    try {
      if (model) {
        await update({ modelId: model.id, title: data.title })
        toast.success('Disciplina atualizada com sucesso.', {
          position: 'top-center',
          duration: 3000,
        })
      } else {
        await create({ title: data.title })
        toast.success('Disciplina criada com sucesso.', {
          position: 'top-center',
          duration: 3000,
        })
      }
      setOpen(false)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro. ${message}`, {
          position: 'top-center',
          duration: 3000,
        })
      } else {
        toast.error(`Erro inesperado: ${(err as Error).message}`, {
          position: 'top-center',
          duration: 3000,
        })
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle>
              {model ? 'Editar disciplina' : 'Adicionar nova disciplina'}
            </DialogTitle>
            <DialogDescription>
              {model
                ? 'Altere as informações da disciplina.'
                : 'Preencha o nome da nova disciplina para adicioná-la à lista existente.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <InputAnimated label="Título" {...register('title')} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">
              {model ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
