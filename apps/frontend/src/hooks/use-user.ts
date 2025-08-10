import { useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile } from '@/api/auth/get-profile'
import { signOut } from '@/api/auth/sign-out'
import { updateUser, UpdateUserProps } from '@/api/users/update-user'

// Tipos
export interface User {
  id: string
  firebaseUid: string
  name: string
  email: string
  photoURL: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
  updateUserFn: (userData: UpdateUserProps) => Promise<User>
  logout: () => void
  refetch: () => void
  isAuthenticated: boolean
  hasRole: (role: string | string[]) => boolean
  isAdmin: boolean
}

export function useUser(): UserContextType {
  const queryClient = useQueryClient()

  // Query para buscar dados do usuário atual usando sua função getProfile
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery<User>({
    queryKey: ['currentUser'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      // Não tenta novamente se for erro de autenticação
      if (error?.message?.includes('401') || error?.message?.includes('403')) {
        return false
      }
      return failureCount < 2
    },
  })

  // Mutation para atualizar usuário
  const updateUserMutation = useMutation({
    mutationFn: ({ id, email, name, role }: UpdateUserProps) =>
      updateUser({ email, id, name, role }),
    onSuccess: (updatedUser) => {
      console.log('User updated successfully:', updatedUser)

      // Verifica se a resposta tem a estrutura correta
      const userData = updatedUser?.data || updatedUser

      // Atualiza o cache com os novos dados
      queryClient.setQueryData(['currentUser'], userData)

      // Invalida a query para forçar um refetch se necessário
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })

      // Invalida outras queries relacionadas se necessário
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('Error updating user:', error)
    },
  })

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      // Limpa todos os dados do cache
      queryClient.clear()
      // Ou redireciona para login
      window.location.href = '/login'
    },
  })

  // Função para atualizar usuário
  const updateUserFn = useCallback(
    async (userData: UpdateUserProps) => {
      if (!user?.id) {
        throw new Error('No user logged in')
      }

      // Mescla os dados atuais com os novos dados
      const updateData = {
        id: userData.id || user.id,
        email: userData.email || user.email,
        name: userData.name || user.name,
        role: userData.role || user.role,
      }

      const result = await updateUserMutation.mutateAsync(updateData)

      // Retorna os dados corretos baseado na estrutura da resposta
      return result?.data || result
    },
    [user, updateUserMutation],
  )

  // Função para logout
  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  // Verificar se usuário tem determinado papel
  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user],
  )

  // Verificar se é admin
  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role])

  // Verificar se está autenticado
  const isAuthenticated = useMemo(() => !!user && !error, [user, error])

  return {
    user: user || null,
    isLoading:
      isLoading || updateUserMutation.isPending || logoutMutation.isPending,
    error: error || updateUserMutation.error || logoutMutation.error,
    updateUserFn,
    logout,
    refetch,
    isAuthenticated,
    hasRole,
    isAdmin,
  }
}
