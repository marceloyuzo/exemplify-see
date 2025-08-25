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
import { getSubjectOptions } from '@/api/subject/get-subject.options'
import { useState } from 'react'
import { deleteSubject, DeleteSubjectParam } from '@/api/subject/delete-subject'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import SubjectDialog from '@/components/subject/subject-dialog'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { useRouter } from 'next/navigation'

export interface Subject {
  id: string
  title: string
}

export default function PainelDisciplinas() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null)
  const [openDialogCreate, setOpenDialogCreate] = useState(false)
  const [openDialogEdit, setOpenDialogEdit] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  const queryClient = useQueryClient()

  const { mutateAsync: delSubject } = useMutation({
    mutationFn: ({ subjectId }: DeleteSubjectParam) =>
      deleteSubject({
        subjectId,
      }),
  })

  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: getSubjectOptions,
  })

  function openDeleteDialog(subject: Subject) {
    setSubjectToDelete(subject)
    setIsDialogOpen(true)
  }

  function openEditDialog(subject: Subject) {
    setSelectedSubject(subject)

    setOpenDialogEdit(true)
  }

  async function handleConfirmDelete() {
    if (!subjectToDelete) return
    try {
      await delSubject({ subjectId: subjectToDelete.id })

      queryClient.invalidateQueries({ queryKey: ['subjects'] })

      toast.success('Disciplina deletada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setIsDialogOpen(false)
      setSubjectToDelete(null)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a disciplina. ${message}`, {
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
      label: 'Disciplinas',
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
          <CardTitle>Lista de Disciplinas</CardTitle>
          <CardDescription>
            Visualize e gerencie as disciplinas. É possível adicionar, editar e
            excluir uma disciplina.
          </CardDescription>

          <CardAction>
            <Button onClick={() => setOpenDialogCreate(true)}>
              Adicionar Disciplina
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
              {subjects?.map((item) => (
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
                Tem certeza que deseja excluir essa disciplina ?
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
      <SubjectDialog open={openDialogCreate} setOpen={setOpenDialogCreate} />

      {/* Dialog de edição */}
      <SubjectDialog
        open={openDialogEdit}
        setOpen={setOpenDialogEdit}
        subject={selectedSubject}
      />
    </section>
  )
}
