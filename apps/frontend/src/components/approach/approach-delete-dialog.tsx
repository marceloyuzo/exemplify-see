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
import { GetApproachDetailsResponse } from '@/api/approaches/get-approach-details'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { deleteApproach } from '@/api/approaches/delete-approach'

interface ApproachDeleteDialogProps {
  approachToDelete: GetApproachDetailsResponse | null
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setApproachToDelete: Dispatch<
    SetStateAction<GetApproachDetailsResponse | null>
  >
}

export default function ApproachDeleteDialog({
  open,
  setOpen,
  approachToDelete,
  setApproachToDelete,
}: ApproachDeleteDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: delApproach } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      deleteApproach({
        id,
      }),
  })

  async function handleConfirmDelete() {
    if (!approachToDelete) return
    try {
      await delApproach({ id: approachToDelete.id })

      queryClient.invalidateQueries({ queryKey: ['approach'] })

      toast.success('Eixo deletado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)
      setApproachToDelete(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a abordagem. ${message}`, {
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
            Tem certeza que deseja excluir o eixo{' '}
            <strong>{approachToDelete?.title}</strong>? Esta ação não poderá ser
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
