import { api } from '@/lib/axios'

export interface SignInBody {
  token: string
}

interface SignInResponse {
  success: boolean
  user: {
    id: string
    email: string
    name: string
  }
  message: string
}

export async function signIn({ token }: SignInBody) {
  const response = await api.post<SignInResponse>(
    '/auth/login',
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  return response
}
