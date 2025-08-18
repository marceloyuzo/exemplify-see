import { api } from '@/lib/axios'

interface GetQuestionNextParam {
  answerId: string | null
}

interface Steps {
  id: string
  title: string
  order: number
}

interface AnswerValue {
  id: string
  title: string
  steps: Steps[]
}

interface NextQuestion {
  toQuestionId: string | null
  answerValue: AnswerValue
}

interface GetQuestionNextResponse {
  id: string
  title: string
  transitionsFromHere: NextQuestion[]
}

export async function getQuestionNext({ answerId }: GetQuestionNextParam) {
  const response = await api.get<GetQuestionNextResponse>(
    '/question/question-next',
    {
      params: {
        answerId,
      },
      withCredentials: true,
    },
  )

  return response.data
}
