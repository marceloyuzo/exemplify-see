import { api } from '@/lib/axios'

interface GetQuestionRootParam {
  axisId: string
}

interface AnswerValue {
  id: string
  title: string
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

export async function GetQuestionRoot({ axisId }: GetQuestionRootParam) {
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
