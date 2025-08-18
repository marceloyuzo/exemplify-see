'use client'

import { useState } from 'react'
import { AxisItem } from '@/api/approaches/get-approach-details'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { Trash2Icon } from 'lucide-react'
import { Button } from '../ui/button'
import AxisDialog from './axis-dialog'

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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteAxis } from '@/api/axis/delete-axis'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'

interface AxisListProps {
  axis?: AxisItem[]
}

export default function AxisList({ axis }: AxisListProps) {
  const params = useParams()
  const [axisToDelete, setAxisToDelete] = useState<AxisItem | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { mutateAsync: delAxis } = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      deleteAxis({
        id,
      }),
  })

  function openDeleteDialog(axis: AxisItem) {
    setAxisToDelete(axis)
    setIsDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!axisToDelete) return
    try {
      await delAxis({ id: axisToDelete.id })

      queryClient.invalidateQueries({ queryKey: ['approach'] })

      toast.success('Eixo deletado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setIsDialogOpen(false)
      setAxisToDelete(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar o eixo. ${message}`, {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lista de Eixos</CardTitle>
        <CardDescription>
          Visualize e gerencie os eixos vinculados a esta abordagem. É possível
          adicionar, editar e excluir um eixo
        </CardDescription>

        <CardAction>
          <AxisDialog />
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Nome</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {axis?.map((item) => (
              <TableRow
                className="cursor-pointer"
                key={item.id}
                onClick={() =>
                  router.push(
                    `/painel-administrador/abordagens/${params.abordagemId}/eixos/${item.id}`,
                  )
                }
              >
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={'link'}
                    className="text-secondary-foreground cursor-pointer hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation()
                      openDeleteDialog(item)
                    }}
                  >
                    <Trash2Icon size={18} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o eixo{' '}
              <strong>{axisToDelete?.title}</strong>? Esta ação não poderá ser
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
    </Card>
  )
}
