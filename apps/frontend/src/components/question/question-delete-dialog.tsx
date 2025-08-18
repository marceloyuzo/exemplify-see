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
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { Button } from '../ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteQuestion } from '@/api/questions/delete-question'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { useSingleParam } from '@/utils/single-param'

interface QuestionDeleteDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  questionId: string
}

export default function QuestionDeleteDialog({
  open,
  setOpen,
  title,
  questionId,
}: QuestionDeleteDialogProps) {
  const queryClient = useQueryClient()
  const params = useParams()
  const axisId = useSingleParam(params.eixoId)
  const { mutateAsync: deleteQuestionAsync } = useMutation({
    mutationFn: deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', axisId] })
    },
  })

  async function handleDeleteQuestion() {
    try {
      await deleteQuestionAsync({ questionId })

      toast.success('Questão deletada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a questão. ${message}`, {
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
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant={'destructive'}>Remover pergunta</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="indent-4">
              Tem certeza que deseja excluir a pergunta {'"'}
              <strong>{title}</strong>
              {'"'} ? Esta ação <strong>não poderá ser desfeita</strong> e
              também removerá{' '}
              <strong>todas as perguntas associadas a ela</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline">Cancelar</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                variant="destructive"
                onClick={handleDeleteQuestion}
                autoFocus
              >
                Excluir
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
