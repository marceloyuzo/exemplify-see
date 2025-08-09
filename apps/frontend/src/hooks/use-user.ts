import { useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile } from '@/api/auth/get-profile'
import { signOut } from '@/api/auth/sign-out'

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
  updateUser: (userData: Partial<User>) => Promise<void>
  logout: () => void
  refetch: () => void
  isAuthenticated: boolean
  hasRole: (role: string | string[]) => boolean
  isAdmin: boolean
}

// Simulação de APIs - substitua pelas suas APIs reais
const userApi = {
  // Buscar usuário atual (normalmente do token JWT ou sessão)
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to fetch user')
    }
    return response.json()
  },

  // Atualizar usuário
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to update user')
    }
    return response.json()
  },

  // Logout
  logout: async (): Promise<void> => {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Failed to logout')
    }
  },
}

/**
 * Hook para gerenciar o estado do usuário atual
 * @returns {UserContextType} Objeto com informações e funções do usuário
 */
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
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) =>
      userApi.updateUser(id, userData),
    onSuccess: (updatedUser) => {
      // Atualiza o cache com os novos dados
      queryClient.setQueryData(['currentUser'], updatedUser)
      // Invalida outras queries relacionadas se necessário
      queryClient.invalidateQueries({ queryKey: ['users'] })
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
  const updateUser = useCallback(
    async (userData: Partial<User>) => {
      if (!user?.id) {
        throw new Error('No user logged in')
      }

      await updateUserMutation.mutateAsync({
        id: user.id,
        userData,
      })
    },
    [user?.id, updateUserMutation],
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
    updateUser,
    logout,
    refetch,
    isAuthenticated,
    hasRole,
    isAdmin,
  }
}
