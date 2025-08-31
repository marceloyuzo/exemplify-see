import { Dispatch, SetStateAction } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { deleteLessonPlan } from '@/api/lesson-plan/delete-lesson-plan'
import { useRouter } from 'next/navigation'

interface ExampleDeleteDialogProps {
  lessonPlanId: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function LessonPlanDeleteDialog({
  open,
  setOpen,
  lessonPlanId,
}: ExampleDeleteDialogProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync: delLessonPlan } = useMutation({
    mutationFn: () =>
      deleteLessonPlan({
        id: lessonPlanId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['repository-lesson-plans'],
      })
      queryClient.invalidateQueries({
        queryKey: ['lesson-plan', lessonPlanId],
      })
    },
  })

  async function handleConfirmDelete() {
    try {
      await delLessonPlan()

      toast.success('Plano de aula deletado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)

      router.push('/repositorio/planos-de-aula')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(
          `Aconteceu um erro ao deletar o plano de aula. ${message}`,
          {
            position: 'top-center',
            duration: 3000,
          },
        )
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
            Tem certeza que deseja excluir o plano de aula ? Esta ação não
            poderá ser desfeita.
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
