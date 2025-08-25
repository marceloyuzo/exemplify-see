import { api } from '@/lib/axios'

export interface UpdateTopicBody {
  topicId: string
  title: string
}

export async function updateTopic({ topicId, title }: UpdateTopicBody) {
  const response = await api.patch(
    `/topic/${topicId}`,
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
