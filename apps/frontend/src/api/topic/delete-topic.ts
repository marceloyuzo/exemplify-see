import { api } from '@/lib/axios'

export interface DeleteTopicParam {
  topicId: string
}

export async function deleteTopic({ topicId }: DeleteTopicParam) {
  const response = await api.delete(`/topic/${topicId}`, {
    withCredentials: true,
  })

  return response
}
