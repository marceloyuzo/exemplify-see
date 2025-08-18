import { Step } from '@/components/question/question-dialog'
import { api } from '@/lib/axios'

export interface CreateQuestionBody {
  axisId: string
  title: string
  optionA: string
  optionB: string
  parentTransitionId?: string
  stepsA: Step[]
  stepsB: Step[]
}

export async function createQuestion({
  axisId,
  optionA,
  optionB,
  title,
  parentTransitionId,
  stepsA,
  stepsB,
}: CreateQuestionBody) {
  const response = await api.post('/question', {
    axisId,
    optionA,
    optionB,
    title,
    parentTransitionId,
    stepsA,
    stepsB,
  })

  return response.data
}
