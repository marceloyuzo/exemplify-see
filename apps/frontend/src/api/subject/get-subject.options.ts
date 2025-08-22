import { api } from '@/lib/axios'

interface GetSubjectOptionsResponse {
  id: string
  title: string
}

export async function getSubjectOptions() {
  const response = await api.get<GetSubjectOptionsResponse[]>('/subject', {
    withCredentials: true,
  })

  return response.data
}
