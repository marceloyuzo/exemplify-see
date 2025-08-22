import { api } from '@/lib/axios'

interface GetTopicOptionsResponse {
  id: string
  title: string
}

export async function getTopicOptions() {
  const response = await api.get<GetTopicOptionsResponse[]>('/topic', {
    withCredentials: true,
  })

  return response.data
}
