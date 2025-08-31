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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowUpDownIcon,
  HomeIcon,
  MoreHorizontal,
  SearchIcon,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTablePagination } from '@/components/table/pagination'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import ExampleDeleteDialog from '@/components/example/example-delete-dialog'
import {
  ExampleResponseAdmin,
  findExamplesAdmin,
} from '@/api/example/find-examples-admin'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { approveExample } from '@/api/example/approve-example'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function PainelExemplos() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const [exampleToDelete, setExampleToDelete] =
    useState<ExampleResponseAdmin | null>(null)
  const [open, setOpen] = useState(false)
  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 25
  const orderBy = searchParams.get('orderBy') || 'asc'
  const exampleName = searchParams.get('exampleName') || ''
  const [searchExample, setSearchExample] = useState('')

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['examples-admin', page, perPage, exampleName, orderBy],
    queryFn: () =>
      findExamplesAdmin({
        page,
        perPage,
        exampleName,
        orderBy,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  })

  const { mutateAsync: approveExampleAsync } = useMutation({
    mutationFn: approveExample,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['examples-admin'],
      })
      queryClient.invalidateQueries({
        queryKey: ['examples'],
      })
    },
  })

  useEffect(() => {
    setSearchExample(exampleName)
  }, [exampleName])

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
    updateURL({ exampleName: searchExample, page: 1 })
  }

  function handleSortToggle() {
    const neworderBy = orderBy === 'asc' ? 'desc' : 'asc'
    updateURL({ orderBy: neworderBy })
  }

  function openDeleteDialog(example: ExampleResponseAdmin) {
    setExampleToDelete(example)
    setOpen(true)
  }

  async function handleApproveExample({ id }: { id: string }) {
    try {
      await approveExampleAsync({
        id,
      })

      toast.success('Exemplo aprovado com sucesso.', {
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

        toast.error(`Aconteceu um erro ao aprovar o exemplo. ${message}`, {
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando exemplos...</p>
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
              Erro ao carregar exemplos
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
              Não foi possível carregar os exemplos
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
      label: 'Exemplos',
      isCurrent: true,
    },
  ]

  const examples = data?.data

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
                placeholder="Buscar por nome da exemplo..."
                value={searchExample}
                onChange={(e) => setSearchExample(e.target.value)}
                className="pl-10 w-72"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Buscar
            </Button>
            {exampleName && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchExample('')
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
                <TableHead className="h-11 ">Exemplo</TableHead>
                <TableHead className="h-11 ">Tipo</TableHead>
                <TableHead className="h-11 ">Tema</TableHead>
                <TableHead className="h-11 ">Autor</TableHead>
                <TableHead className="h-11 ">Criado em</TableHead>
                <TableHead className="h-11 ">Atualizado em</TableHead>
                <TableHead className="h-11 ">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examples.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    Nenhum resultado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                examples.map((example) => (
                  <TableRow
                    className="cursor-pointer transition-colors [&:hover]:bg-muted/80"
                    key={example.id}
                    onClick={() =>
                      router.push(`/repositorio/exemplos/${example.id}`)
                    }
                  >
                    <TableCell className="font-medium h-11">
                      {example.title}
                    </TableCell>
                    <TableCell className="h-11">
                      {example.type === 'correct' ? 'Correto' : 'Errôneo'}
                    </TableCell>
                    <TableCell className="h-11">
                      {example.topic.title}
                    </TableCell>
                    <TableCell className="h-11">
                      {example.author.name}
                    </TableCell>
                    <TableCell className="h-11">
                      {new Date(example.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="h-11">
                      {new Date(example.updatedAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="h-11">
                      {example.isApprove ? 'Aprovado' : 'Pendente'}
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
                              handleApproveExample({ id: example.id })
                            }}
                          >
                            Aprovar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDeleteDialog(example)
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

        <ExampleDeleteDialog
          exampleToDelete={exampleToDelete}
          open={open}
          setOpen={setOpen}
          setExampleToDelete={setExampleToDelete}
        />
      </div>
    </>
  )
}
