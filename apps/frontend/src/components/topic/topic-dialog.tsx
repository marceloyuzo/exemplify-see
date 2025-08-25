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
import { createTopic, CreateTopicBody } from '@/api/topic/create-topic'
import { updateTopic, UpdateTopicBody } from '@/api/topic/update-topic'
import { Topic } from '@/app/painel-administrador/temas/page'

const topicSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

type TopicSchema = z.infer<typeof topicSchema>

interface TopicDialogProps {
  topic?: Topic | null
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function TopicDialog({
  topic,
  open,
  setOpen,
}: TopicDialogProps) {
  const { register, handleSubmit, reset } = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: topic?.title ?? '',
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: create } = useMutation({
    mutationFn: ({ title }: CreateTopicBody) => createTopic({ title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })

  const { mutateAsync: update } = useMutation({
    mutationFn: ({ topicId, title }: UpdateTopicBody) =>
      updateTopic({ topicId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] })
    },
  })

  useEffect(() => {
    if (topic) {
      reset({ title: topic.title })
    } else {
      reset({ title: '' })
    }
  }, [topic, reset, open])

  async function handleSubmitForm(data: TopicSchema) {
    try {
      if (topic) {
        await update({ topicId: topic.id, title: data.title })
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
              {topic ? 'Editar disciplina' : 'Adicionar nova disciplina'}
            </DialogTitle>
            <DialogDescription>
              {topic
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
              {topic ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
