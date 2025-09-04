import { api } from '@/lib/axios'

interface GetQuestionParams {
  questionId: string
}

interface Step {
  id: string
  title: string
  description?: string
  order: number
}

interface Answer {
  id: string
  title: string
  steps: Step[]
}

interface Transition {
  id: string
  fromQuestionId: string
  answerId: string
  toQuestionId: string | null
  answerValue: Answer
}

export interface GetQuestionResponse {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  axisId: string
  transitionsFromHere: Transition[]
}

export async function getQuestion({ questionId }: GetQuestionParams) {
  const response = await api.get<GetQuestionResponse>(
    `/question/${questionId}`,
    {
      withCredentials: true,
    },
  )

  return response.data
}
