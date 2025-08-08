import { api } from '@/lib/axios'

interface SignOutResponse {
  success: boolean
  message: string
}

export async function signOut() {
  const response = await api.post<SignOutResponse>(
    '/auth/logout',
    {},
    {
      withCredentials: true,
    },
  )

  return response
}
