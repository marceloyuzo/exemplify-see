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
import { deleteModel, DeleteModelParam } from '@/api/models/delete-model'
import { getModelOptions } from '@/api/models/get-model-options'
import ModelDialog from '@/components/model/model-dialog'

export interface Model {
  id: string
  title: string
}

export default function PainelModelos() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [modelToDelete, setModelToDelete] = useState<Model | null>(null)
  const [openDialogCreate, setOpenDialogCreate] = useState(false)
  const [openDialogEdit, setOpenDialogEdit] = useState(false)
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const queryClient = useQueryClient()

  const { mutateAsync: delModel } = useMutation({
    mutationFn: ({ modelId }: DeleteModelParam) =>
      deleteModel({
        modelId,
      }),
  })

  const { data: models } = useQuery({
    queryKey: ['models'],
    queryFn: getModelOptions,
  })

  function openDeleteDialog(model: Model) {
    setModelToDelete(model)
    setIsDialogOpen(true)
  }

  function openEditDialog(model: Model) {
    setSelectedModel(model)

    setOpenDialogEdit(true)
  }

  async function handleConfirmDelete() {
    if (!modelToDelete) return
    try {
      await delModel({ modelId: modelToDelete.id })

      queryClient.invalidateQueries({ queryKey: ['models'] })

      toast.success('Modelo deletada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setIsDialogOpen(false)
      setModelToDelete(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a modelo. ${message}`, {
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
      label: 'Modelos',
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
          <CardTitle>Lista de Modelos</CardTitle>
          <CardDescription>
            Visualize e gerencie as modelos. É possível adicionar, editar e
            excluir uma modelo.
          </CardDescription>

          <CardAction>
            <Button onClick={() => setOpenDialogCreate(true)}>
              Adicionar Modelo
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
              {models?.map((item) => (
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
                Tem certeza que deseja excluir essa modelo ?
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
      <ModelDialog open={openDialogCreate} setOpen={setOpenDialogCreate} />

      {/* Dialog de edição */}
      <ModelDialog
        open={openDialogEdit}
        setOpen={setOpenDialogEdit}
        model={selectedModel}
      />
    </section>
  )
}
