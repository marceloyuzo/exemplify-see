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
import { deleteRating, DeleteRatingProps } from '@/api/rating/delete-rating'

interface ExampleRatingDeleteDialogProps {
  ratingId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function ExampleRatingDeleteDialog({
  open,
  setOpen,
  ratingId,
}: ExampleRatingDeleteDialogProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: delRating } = useMutation({
    mutationFn: ({ id }: DeleteRatingProps) =>
      deleteRating({
        id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ratings'] })
    },
  })

  async function handleConfirmDelete() {
    try {
      await delRating({ id: ratingId })

      toast.success('Avaliação deletado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a avaliação. ${message}`, {
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
            Tem certeza que deseja excluir essa avaliação? Esta ação não poderá
            ser desfeita.
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
