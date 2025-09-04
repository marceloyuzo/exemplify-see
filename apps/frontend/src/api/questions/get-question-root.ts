import { api } from '@/lib/axios'

interface GetQuestionRootParam {
  axisId: string
}

export interface Steps {
  id: string
  title: string
  description?: string
  order: number
}

export interface AnswerValue {
  id: string
  title: string
  steps: Steps[]
}

interface NextQuestion {
  toQuestionId: string | null
  answerValue: AnswerValue
}

interface GetQuestionRootResponse {
  id: string
  title: string
  transitionsFromHere: NextQuestion[]
}

export async function getQuestionRoot({ axisId }: GetQuestionRootParam) {
  const response = await api.get<GetQuestionRootResponse>(
    '/question/question-root',
    {
      params: {
        axisId,
      },
      withCredentials: true,
    },
  )

  return response.data
}
