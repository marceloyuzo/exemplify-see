import { User } from '@/hooks/use-user'
import { api } from '@/lib/axios'

export interface GetProfileResponse {
  success: boolean
  user: User
}

export async function getProfile(): Promise<User> {
  const response = await api.get<GetProfileResponse>('/auth/me', {
    withCredentials: true,
  })

  return response.data.user
}
