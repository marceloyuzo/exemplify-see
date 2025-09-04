'use client'

import { Dispatch, SetStateAction } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { deleteExample, DeleteExampleProps } from '@/api/example/delete-example'
import { ExampleResponseAdmin } from '@/api/example/find-examples-admin'
import { GetExampleDetailedResponse } from '@/api/example/get-example-detailed'
import { useRouter } from 'next/navigation'

interface ExampleDeleteDialogProps {
  exampleToDelete: ExampleResponseAdmin | null | GetExampleDetailedResponse
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setExampleToDelete?: Dispatch<SetStateAction<ExampleResponseAdmin | null>>
}

export default function ExampleDeleteDialog({
  open,
  setOpen,
  exampleToDelete,
  setExampleToDelete,
}: ExampleDeleteDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutateAsync: delExample } = useMutation({
    mutationFn: ({ id }: DeleteExampleProps) =>
      deleteExample({
        id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['examples-admin'],
      })
      queryClient.invalidateQueries({
        queryKey: ['examples'],
      })
    },
  })

  async function handleConfirmDelete() {
    if (!exampleToDelete) return
    try {
      await delExample({ id: exampleToDelete.id })

      toast.success('Exemplo deletado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)

      router.push('/repositorio/exemplos')
      if (setExampleToDelete) setExampleToDelete(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar o exemplo. ${message}`, {
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
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o exemplo{' '}
            <strong>{exampleToDelete?.title}</strong> ? Esta ação não poderá ser
            desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">Cancelar</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              autoFocus
            >
              Excluir
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
