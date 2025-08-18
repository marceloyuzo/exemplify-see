import { api } from '@/lib/axios'

interface FindManyQuestionsQuery {
  axisId: string
}

export interface Answer {
  title: string
}

export interface Transition {
  id: string
  fromQuestionId: string
  answerId: string
  answerValue: Answer
  toQuestionId: string | null
}

export interface Question {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  axisId: string
  transitionsFromHere: Transition[]
  transitionToHere: Transition | null
}

// Response do endpoint
export type FindManyQuestionsResponse = Question[]

export async function findManyQuestions({
  axisId,
}: FindManyQuestionsQuery): Promise<FindManyQuestionsResponse> {
  const response = await api.get<FindManyQuestionsResponse>('/question', {
    params: {
      axisId,
    },
  })

  return response.data
}
