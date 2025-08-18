import { api } from '@/lib/axios'

interface DeleteQuestionProps {
  questionId: string
}

export async function deleteQuestion({ questionId }: DeleteQuestionProps) {
  const response = await api.delete(`/question/${questionId}`, {
    withCredentials: true,
  })

  return response.data
}
