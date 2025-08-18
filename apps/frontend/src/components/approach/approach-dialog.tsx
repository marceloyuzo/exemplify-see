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
  DialogTrigger,
} from '../ui/dialog'
import { InputAnimated } from '../ui/input-animated'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Dispatch, SetStateAction } from 'react'
import {
  createApproach,
  CreateApproachProps,
} from '@/api/approaches/create-approach'

const createNewApproachSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

type CreateNewApproachSchema = z.infer<typeof createNewApproachSchema>

interface ApproachDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ApproachDialog({ open, setOpen }: ApproachDialogProps) {
  const { register, handleSubmit } = useForm<CreateNewApproachSchema>({
    resolver: zodResolver(createNewApproachSchema),
  })
  const queryClient = useQueryClient()

  const { mutateAsync: create } = useMutation({
    mutationFn: ({ title }: CreateApproachProps) =>
      createApproach({
        title,
      }),
  })

  async function handleCreateNewApproach(data: CreateNewApproachSchema) {
    try {
      await create({
        title: data.title,
      })

      toast.success('Abordagem criada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      queryClient.invalidateQueries({
        queryKey: ['approach'],
      })

      setOpen(false)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao criar a abordagem. ${message}`, {
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
      <DialogTrigger asChild>
        <Button variant="default">Adicionar</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit(handleCreateNewApproach)}
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle>Adicionar nova abordagem</DialogTitle>
            <DialogDescription>
              Preencha o título do nova abordagem para adicioná-lo à lista
              existente.
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
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
