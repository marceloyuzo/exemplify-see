'use client'

import {
  findApproach,
  FindApproachResponse,
} from '@/api/approaches/find-approach'
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
import { ArrowUpDownIcon, HomeIcon, SearchIcon, Trash2Icon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTablePagination } from '@/components/table/pagination'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import ApproachDialog from '@/components/approach/approach-dialog'
import { GetApproachDetailsResponse } from '@/api/approaches/get-approach-details'
import ApproachDeleteDialog from '@/components/approach/approach-delete-dialog'

export default function PainelAbordagens() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [approachToDelete, setApproachToDelete] =
    useState<GetApproachDetailsResponse | null>(null)
  const [open, setOpen] = useState(false)

  function openDeleteDialog(approach: GetApproachDetailsResponse) {
    setApproachToDelete(approach)
    setOpen(true)
  }

  const [searchApproach, setSearchApproach] = useState('')

  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 25
  const orderBy = searchParams.get('orderBy') || 'asc'
  const approachName = searchParams.get('approachName') || ''

  useEffect(() => {
    setSearchApproach(approachName)
  }, [approachName])

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
    updateURL({ approachName: searchApproach, page: 1 })
  }

  function handleSortToggle() {
    const neworderBy = orderBy === 'asc' ? 'desc' : 'asc'
    updateURL({ orderBy: neworderBy })
  }

  function handleClickApproach(id: string) {
    router.push(`/painel-administrador/abordagens/${id}`)
  }

  const { data, isLoading, error, isFetching } = useQuery<FindApproachResponse>(
    {
      queryKey: ['approach', page, perPage, approachName, orderBy],
      queryFn: () =>
        findApproach({
          page,
          perPage,
          approachName,
          orderBy,
        }),
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      refetchOnWindowFocus: false,
      retry: 3,
    },
  )

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando abordagens...</p>
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
              Erro ao carregar abordagens
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
              Não foi possível carregar as abordagens
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
      label: 'Abordagens',
      isCurrent: true,
    },
  ]

  const approaches = data?.data

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.push('/painel-administrador')}
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

        <div className="flex items-center justify-between gap-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome da abordagem..."
                value={searchApproach}
                onChange={(e) => setSearchApproach(e.target.value)}
                className="pl-10 w-72"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Buscar
            </Button>
            {approachName && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchApproach('')
                  updateURL({ approachName: '', page: 1 })
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
            <Button
              variant="default"
              size="default"
              onClick={() => setIsDialogOpen(true)}
            >
              Adicionar
            </Button>
          </div>
        </div>

        <div className="bg-background overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-11 w-1/3">Abordagem</TableHead>
                <TableHead className="h-11 w-2/3">Eixos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approaches.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum resultado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                approaches.map((approach) => (
                  <TableRow
                    className="cursor-pointer transition-colors [&:hover]:bg-muted/80"
                    key={approach.id}
                    onClick={() => handleClickApproach(approach.id)}
                  >
                    <TableCell className="font-medium w-1/3">
                      {approach.title}
                    </TableCell>
                    <TableCell className="w-2/3">
                      {approach.axis
                        .map((item, index) => `${index + 1} - ${item.title}`)
                        .join(', ')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant={'link'}
                        className="text-secondary-foreground cursor-pointer hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation()
                          openDeleteDialog(approach)
                        }}
                      >
                        <Trash2Icon size={18} />
                      </Button>
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

        <ApproachDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
        <ApproachDeleteDialog
          approachToDelete={approachToDelete}
          open={open}
          setOpen={setOpen}
          setApproachToDelete={setApproachToDelete}
        />
      </div>
    </>
  )
}
