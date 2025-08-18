import { api } from '@/lib/axios'

interface GetAxisListParams {
  approachId: string
}

interface GetAxisListResponse {
  id: string
  title: string
  approachesId: string
}

export async function getAxisList({ approachId }: GetAxisListParams) {
  const response = await api.get<GetAxisListResponse[]>('/axis', {
    params: {
      approachId,
    },
    withCredentials: true,
  })

  return response.data
}
