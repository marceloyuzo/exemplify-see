'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import {
  ArrowUpDownIcon,
  HomeIcon,
  MoreHorizontal,
  SearchIcon,
} from 'lucide-react'
import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTablePagination } from '@/components/table/pagination'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { findLessonPlansAdmin } from '@/api/lesson-plan/find-lesson-plans-admin'
import { LessonPlanResponse } from '@/api/lesson-plan/update-lesson-plan'
import LessonPlanDeleteDialog from '@/components/lesson-plan/lesson-plan-dialogs/lesson-plan-delete-dialog'

export default function PainelPlanosDeAulaClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [lessonPlanToDelete, setLessonPlanToDelete] = useState<string>('')
  const [open, setOpen] = useState(false)
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 25
  const orderBy = searchParams.get('orderBy') || 'asc'
  const lessonPlanName = searchParams.get('lessonPlanName') || ''
  const [searchLessonPlan, setSearchLessonPlan] = useState('')

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['lesson-plans-admin', page, perPage, lessonPlanName, orderBy],
    queryFn: () =>
      findLessonPlansAdmin({
        page,
        perPage,
        lessonPlanName,
        orderBy,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  })

  useEffect(() => {
    setSearchLessonPlan(lessonPlanName)
  }, [lessonPlanName])

  const updateURL = useCallback(
    (params: Record<string, string | number>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(params).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      router.push(`?${current.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateURL({ lessonPlanName: searchLessonPlan, page: 1 })
  }

  function handleSortToggle() {
    const neworderBy = orderBy === 'asc' ? 'desc' : 'asc'
    updateURL({ orderBy: neworderBy })
  }

  function openDeleteDialog(lessonPlan: LessonPlanResponse) {
    setLessonPlanToDelete(lessonPlan.id)
    setOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando planos de aula...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-destructive mb-1">
              Erro ao carregar o plano de aula
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || 'Ocorreu um erro inesperado'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!data?.data) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="rounded-full bg-muted p-3">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Nenhum dado disponível
            </p>
            <p className="text-xs text-muted-foreground">
              Não foi possível carregar os planos de aula
            </p>
          </div>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Painel Administrador', href: '/painel-administrador' },
    {
      label: 'Planos de Aula',
      isCurrent: true,
    },
  ]

  const lessonPlans = data?.data

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Voltar
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        {isFetching && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-background border rounded-md px-3 py-2 shadow-lg flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Atualizando...
              </span>
            </div>
          </div>
        )}

        <Suspense fallback={<div>Carregando exemplos...</div>}>
          <div className="flex items-center justify-between gap-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome do plano de aula..."
                  value={searchLessonPlan}
                  onChange={(e) => setSearchLessonPlan(e.target.value)}
                  className="pl-10 w-72"
                />
              </div>
              <Button type="submit" variant="outline" size="sm">
                Buscar
              </Button>
              {lessonPlanName && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchLessonPlan('')
                    updateURL({ exampleName: '', page: 1 })
                  }}
                >
                  Limpar
                </Button>
              )}
            </form>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="default"
                onClick={handleSortToggle}
                className="flex items-center gap-2"
              >
                <ArrowUpDownIcon className="h-4 w-4" />
                Data de Criação
                {orderBy === 'desc' ? ' ↓' : ' ↑'}
              </Button>
            </div>
          </div>

          <div className="bg-background overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-11 ">Plano de Aula</TableHead>
                  <TableHead className="h-11 ">Tipo do Exemplo</TableHead>
                  <TableHead className="h-11 ">Disciplina</TableHead>
                  <TableHead className="h-11 ">Tema</TableHead>
                  <TableHead className="h-11 ">Autor</TableHead>
                  <TableHead className="h-11 ">Criado em</TableHead>
                  <TableHead className="h-11 ">Atualizado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessonPlans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum resultado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  lessonPlans.map((lessonPlan) => (
                    <TableRow
                      className="cursor-pointer transition-colors [&:hover]:bg-muted/80"
                      key={lessonPlan.id}
                      onClick={() =>
                        router.push(
                          `/repositorio/planos-de-aula/${lessonPlan.id}`,
                        )
                      }
                    >
                      <TableCell className="font-medium h-11">
                        {lessonPlan.title}
                      </TableCell>
                      <TableCell className="h-11">
                        {lessonPlan.example}
                      </TableCell>
                      <TableCell className="h-11">
                        {lessonPlan.subject.title}
                      </TableCell>
                      <TableCell className="h-11">
                        {lessonPlan.topic.title}
                      </TableCell>
                      <TableCell className="h-11">
                        {lessonPlan.user.name}
                      </TableCell>
                      <TableCell className="h-11">
                        {new Date(lessonPlan.createdAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </TableCell>
                      <TableCell className="h-11">
                        {new Date(lessonPlan.updatedAt).toLocaleDateString(
                          'pt-BR',
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir Menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                openDeleteDialog(lessonPlan)
                              }}
                            >
                              Deletar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DataTablePagination
            currentPage={data.meta.page}
            totalPages={data.meta.totalPages}
            perPage={perPage}
          />
        </Suspense>

        <LessonPlanDeleteDialog
          lessonPlanId={lessonPlanToDelete}
          open={open}
          setOpen={setOpen}
        />
      </div>
    </>
  )
}
