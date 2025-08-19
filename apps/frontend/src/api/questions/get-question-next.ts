import { api } from '@/lib/axios'
import { AnswerValue } from './get-question-root'

interface GetQuestionNextParam {
  answerId: string | null
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
