'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
  Edit2,
  HomeIcon,
  MoreHorizontal,
  SearchIcon,
  Trash2,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTablePagination } from '@/components/table/pagination'
import { findUsers, FindUsersResponse } from '@/api/users/find-users'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import EditUserDialog from '@/components/user/edit-user-dialog'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'

const USER_ROLES = [
  { value: 'all', label: 'Todos os papéis' },
  { value: 'admin', label: 'Administrador' },
  { value: 'user', label: 'Usuário' },
]

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

function UserActionsMenu({ id, name, email, role }: User) {
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuItem
            onSelect={() => setEditDialogOpen(true)}
            className="cursor-pointer"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => console.log('Excluir usuário:', id)}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserDialog
        open={editDialogOpen}
        setOpen={setEditDialogOpen}
        id={id}
        name={name}
        email={email}
        role={role}
      />
    </>
  )
}

export default function UsersTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchName, setSearchName] = useState('')

  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 25
  const orderBy = searchParams.get('orderBy') || 'asc'
  const name = searchParams.get('name') || ''
  const role = searchParams.get('role') || 'all'

  useEffect(() => {
    setSearchName(name)
  }, [name])

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
    updateURL({ name: searchName, page: 1 })
  }

  function handleSortToggle() {
    const neworderBy = orderBy === 'asc' ? 'desc' : 'asc'
    updateURL({ orderBy: neworderBy })
  }

  function handleRoleChange(value: string) {
    const roleValue = value === 'all' ? '' : value
    updateURL({ role: roleValue, page: 1 })
  }

  function handleClearFilters() {
    setSearchName('')
    updateURL({ name: '', role: '', page: 1 })
  }

  const { data, isLoading, error, isFetching } = useQuery<FindUsersResponse>({
    queryKey: [
      'users',
      page,
      perPage,
      name,
      role === 'all' ? '' : role,
      orderBy,
    ],
    queryFn: () =>
      findUsers({
        page,
        perPage,
        name,
        role: role === 'all' ? '' : role,
        orderBy,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  })

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando Usuários...</p>
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
              Erro ao carregar usuários
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
              Não foi possível carregar os usuários
            </p>
          </div>
        </div>
      </div>
    )
  }

  const users = data?.data
  const hasActiveFilters = name || (role && role !== 'all')

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Painel Administrador', href: '/painel-administrador' },
    { label: 'Usuários', isCurrent: true },
  ]

  return (
    <div className="space-y-4 w-full">
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.push('/painel-administrador/abordagens')}
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
        <div className="flex items-center gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-10 w-72"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Buscar
            </Button>
          </form>

          <Select value={role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrar por papel" />
            </SelectTrigger>
            <SelectContent>
              {USER_ROLES.map((roleOption) => (
                <SelectItem key={roleOption.value} value={roleOption.value}>
                  {roleOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
            >
              Limpar filtros
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleSortToggle}
          className="flex items-center gap-2"
        >
          <ArrowUpDownIcon className="h-4 w-4" />
          Data de Criação
          {orderBy === 'desc' ? ' ↓' : ' ↑'}
        </Button>
      </div>

      <div className="bg-background overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="h-11"></TableHead>
              <TableHead className="h-11">Nome</TableHead>
              <TableHead className="h-11">Email</TableHead>
              <TableHead className="h-11">Papel</TableHead>
              <TableHead className="h-11">Data de criação</TableHead>
              <TableHead className="h-11"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum resultado encontrado
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  className="transition-colors [&:hover]:bg-muted/80"
                  key={user.id}
                >
                  <TableCell></TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <UserActionsMenu
                      email={user.email}
                      id={user.id}
                      name={user.name}
                      role={user.role}
                      key={user.id}
                    />
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
    </div>
  )
}
