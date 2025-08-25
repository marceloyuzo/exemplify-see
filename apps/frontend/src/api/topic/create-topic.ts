import { api } from '@/lib/axios'

export interface CreateTopicBody {
  title: string
}

export async function createTopic({ title }: CreateTopicBody) {
  const response = await api.post(
    '/topic',
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
