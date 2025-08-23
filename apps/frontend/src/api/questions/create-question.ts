import { Step } from '@/components/question/question-dialog'
import { api } from '@/lib/axios'

export interface CreateQuestionBody {
  axisId: string
  title: string
  optionA: string
  optionB: string
  optionC?: string
  parentTransitionId?: string
  stepsA: Step[]
  stepsB: Step[]
  stepsC?: Step[]
}

export async function createQuestion({
  axisId,
  optionA,
  optionB,
  optionC,
  title,
  parentTransitionId,
  stepsA,
  stepsB,
  stepsC,
}: CreateQuestionBody) {
  const payload = {
    axisId,
    optionA,
    optionB,
    title,
    parentTransitionId,
    stepsA,
    stepsB,
  }

  if (optionC && optionC.trim()) {
    Object.assign(payload, {
      optionC: optionC.trim(),
      stepsC: stepsC || [],
    })
  }

  const response = await api.post('/question', payload)

  return response.data
}
