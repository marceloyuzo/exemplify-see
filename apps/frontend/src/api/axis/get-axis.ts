import { api } from '@/lib/axios'

interface GetAxisParams {
  id: string
}

export interface GetAxisResponse {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  approachesId: string
  approache: {
    title: string
  }
}

export async function getAxis({ id }: GetAxisParams) {
  const response = await api.get<GetAxisResponse>(`/axis/${id}`, {
    withCredentials: true,
  })

  return response.data
}
