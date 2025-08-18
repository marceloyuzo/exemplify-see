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
import { useParams } from 'next/navigation'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { useState } from 'react'
import { createAxis, CreateAxisProps } from '@/api/axis/create-axis'
import { useSingleParam } from '@/utils/single-param'

const createNewAxisSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

type CreateNewAxisSchema = z.infer<typeof createNewAxisSchema>

export default function AxisDialog() {
  const params = useParams()
  const approachId = useSingleParam(params.abordagemId)
  const [open, setOpen] = useState(false)
  const { register, handleSubmit } = useForm<CreateNewAxisSchema>({
    resolver: zodResolver(createNewAxisSchema),
  })
  const queryClient = useQueryClient()

  const { mutateAsync: create } = useMutation({
    mutationFn: ({ approachId, title }: CreateAxisProps) =>
      createAxis({
        approachId,
        title,
      }),
  })

  async function handleCreateNewAxis(data: CreateNewAxisSchema) {
    try {
      await create({
        approachId,
        title: data.title,
      })

      toast.success('Eixo criado com sucesso.', {
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

        toast.error(`Aconteceu um erro ao criar o eixo. ${message}`, {
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
          onSubmit={handleSubmit(handleCreateNewAxis)}
          className="flex flex-col gap-6"
        >
          <DialogHeader>
            <DialogTitle>Adicionar novo eixo</DialogTitle>
            <DialogDescription>
              Preencha o título do novo eixo para adicioná-lo à lista existente.
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
