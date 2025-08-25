import { api } from '@/lib/axios'

interface GetModelOptionsResponse {
  id: string
  title: string
}

export async function getModelOptions() {
  const response = await api.get<GetModelOptionsResponse[]>('/model', {
    withCredentials: true,
  })

  return response.data
}
