'use client'

import { UserIcon, LogOutIcon, BoltIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { toast } from 'sonner'
import { useUser } from '@/hooks/use-user'
import { useState } from 'react'
import EditProfileDialog from '../user/edit-profile-dialog'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const { user, logout, isLoading, error } = useUser()
  const router = useRouter()

  async function handleSignOut() {
    try {
      logout()

      toast.success(`Logout realizado com sucesso`, {
        position: 'top-center',
        duration: 5000,
      })
    } catch (error) {
      console.error('Erro no logout:', error)
    }
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        className="cursor-pointer h-auto p-3 rounded-full hover:bg-accent hover:text-accent-foreground"
        onClick={() => router.push('/login')}
        aria-label="Entrar"
      >
        <UserIcon size={28} />
      </Button>
    )
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="cursor-pointer h-auto p-0 hover:bg-transparent"
          >
            <Avatar>
              <AvatarImage src={user.photoURL} alt="Profile image" />
              <AvatarFallback>teste</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="max-w-64" align="end">
          <DropdownMenuLabel className="flex min-w-0 flex-col">
            <span className="text-primary truncate text-sm font-medium">
              {isLoading ? 'Carregando...' : user.name}
            </span>
            <span className="text-muted-foreground truncate text-xs font-normal">
              {isLoading ? '' : user.email}
            </span>
            {error && (
              <span className="text-red-500 text-xs mt-1">
                Erro ao carregar dados
              </span>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              className="cursor-pointer hover:bg-background transition-colors duration-200"
              onSelect={() => setOpen(true)}
            >
              <BoltIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Editar perfil</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer hover:bg-background transition-colors duration-200"
              onClick={handleSignOut}
            >
              <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
              <span>Sair da conta</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProfileDialog open={open} setOpen={setOpen} />
    </>
  )
}
