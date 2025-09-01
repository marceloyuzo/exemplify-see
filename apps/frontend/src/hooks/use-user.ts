import { useCallback, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile } from '@/api/auth/get-profile'
import { signOut } from '@/api/auth/sign-out'
import { updateProfile, UpdateProfileProps } from '@/api/users/update-profile'

export interface User {
  id: string
  firebaseUid: string
  name: string
  email: string
  photoURL: string
  firstTime: boolean
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

interface UserContextType {
  user: User | null
  isLoading: boolean
  error: Error | null
  updateUserFn: (userData: UpdateProfileProps) => Promise<User>
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
    mutationFn: ({ id, email, name }: UpdateProfileProps) =>
      updateProfile({ email, id, name }),
    onSuccess: (updatedUser) => {
      const userData = updatedUser?.data || updatedUser

      queryClient.setQueryData(['currentUser'], userData)
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
    onError: (error) => {
      console.error('Error updating user:', error)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear()
      window.location.href = '/login'
    },
  })

  // Função para atualizar usuário
  const updateUserFn = useCallback(
    async (userData: UpdateProfileProps) => {
      if (!user?.id) {
        throw new Error('No user logged in')
      }

      const updateData = {
        id: user.id,
        email: userData.email || user.email,
        name: userData.name || user.name,
        role: user.role,
      }

      const result = await updateUserMutation.mutateAsync(updateData)

      return result?.data || result
    },
    [user, updateUserMutation],
  )

  const logout = useCallback(() => {
    logoutMutation.mutate()
  }, [logoutMutation])

  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user],
  )

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role])
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
