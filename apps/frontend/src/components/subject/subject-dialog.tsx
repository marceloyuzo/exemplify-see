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
import { createSubject, CreateSubjectBody } from '@/api/subject/create-subject'
import { updateSubject, UpdateSubjectBody } from '@/api/subject/update-subject'
import { Subject } from '@/app/painel-administrador/disciplinas/page'

const subjectSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

type SubjectSchema = z.infer<typeof subjectSchema>

interface SubjectDialogProps {
  subject?: Subject | null
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function SubjectDialog({
  subject,
  open,
  setOpen,
}: SubjectDialogProps) {
  const { register, handleSubmit, reset } = useForm<SubjectSchema>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      title: subject?.title ?? '',
    },
  })

  const queryClient = useQueryClient()

  const { mutateAsync: create } = useMutation({
    mutationFn: ({ title }: CreateSubjectBody) => createSubject({ title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })

  const { mutateAsync: update } = useMutation({
    mutationFn: ({ subjectId, title }: UpdateSubjectBody) =>
      updateSubject({ subjectId, title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })

  useEffect(() => {
    if (subject) {
      reset({ title: subject.title })
    } else {
      reset({ title: '' })
    }
  }, [subject, reset, open])

  async function handleSubmitForm(data: SubjectSchema) {
    try {
      if (subject) {
        await update({ subjectId: subject.id, title: data.title })
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
              {subject ? 'Editar disciplina' : 'Adicionar nova disciplina'}
            </DialogTitle>
            <DialogDescription>
              {subject
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
              {subject ? 'Salvar alterações' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
