import { api } from '@/lib/axios'

interface FindUsersProps {
  page: number
  perPage: number
  name?: string
  role?: string
}

export interface FindUsersResponse {
  data: {
    id: string
    firebaseUid: string
    name: string
    email: string
    role: 'admin' | 'user'
    photoUrl: string
    createdAt: string
    updatedAt: string
  }[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findUsers({
  page,
  perPage,
  name,
  role,
}: FindUsersProps): Promise<FindUsersResponse> {
  const response = await api.get<FindUsersResponse>('/users', {
    params: {
      page,
      perPage,
      name,
      role,
    },
    withCredentials: true,
  })

  return response.data
}
