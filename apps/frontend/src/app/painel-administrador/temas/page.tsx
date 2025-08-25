'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
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
import { HomeIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { useRouter } from 'next/navigation'
import { deleteTopic, DeleteTopicParam } from '@/api/topic/delete-topic'
import { getTopicOptions } from '@/api/topic/get-topic-options'
import TopicDialog from '@/components/topic/topic-dialog'

export interface Topic {
  id: string
  title: string
}

export default function PainelTemas() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [topicToDelete, setTopicToDelete] = useState<Topic | null>(null)
  const [openDialogCreate, setOpenDialogCreate] = useState(false)
  const [openDialogEdit, setOpenDialogEdit] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  const queryClient = useQueryClient()

  const { mutateAsync: delTopic } = useMutation({
    mutationFn: ({ topicId }: DeleteTopicParam) =>
      deleteTopic({
        topicId,
      }),
  })

  const { data: topics } = useQuery({
    queryKey: ['topics'],
    queryFn: getTopicOptions,
  })

  function openDeleteDialog(topic: Topic) {
    setTopicToDelete(topic)
    setIsDialogOpen(true)
  }

  function openEditDialog(topic: Topic) {
    setSelectedTopic(topic)

    setOpenDialogEdit(true)
  }

  async function handleConfirmDelete() {
    if (!topicToDelete) return
    try {
      await delTopic({ topicId: topicToDelete.id })

      queryClient.invalidateQueries({ queryKey: ['topics'] })

      toast.success('Tema deletada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setIsDialogOpen(false)
      setTopicToDelete(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a tema. ${message}`, {
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

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Painel Administrador', href: '/painel-administrador' },
    {
      label: 'Temas',
      isCurrent: true,
    },
  ]

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.push(`/painel-administrador`)}
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Lista de Temas</CardTitle>
          <CardDescription>
            Visualize e gerencie os temas. É possível adicionar, editar e
            excluir um tema.
          </CardDescription>

          <CardAction>
            <Button onClick={() => setOpenDialogCreate(true)}>
              Adicionar Tema
            </Button>
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
              {topics?.map((item) => (
                <TableRow
                  className="cursor-pointer"
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    openEditDialog(item)
                  }}
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
                Tem certeza que deseja excluir essa tema ?
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

      {/* Dialog de criação */}
      <TopicDialog open={openDialogCreate} setOpen={setOpenDialogCreate} />

      {/* Dialog de edição */}
      <TopicDialog
        open={openDialogEdit}
        setOpen={setOpenDialogEdit}
        topic={selectedTopic}
      />
    </section>
  )
}
