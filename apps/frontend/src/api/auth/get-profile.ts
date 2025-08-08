import { api } from '@/lib/axios'

export interface GetProfileResponse {
  success: boolean
  user: {
    id: string
    email: string
    name: string
    photoURL: string
  }
}

export async function getProfile() {
  const response = await api.get<GetProfileResponse>('/auth/me', {
    withCredentials: true,
  })

  return response.data
}
