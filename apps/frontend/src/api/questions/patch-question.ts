import { Step } from '@/components/question/question-dialog'
import { api } from '@/lib/axios'

export interface PatchQuestionBody {
  questionId: string
  title: string
  optionIdA: string
  optionValueA: string
  optionIdB: string
  optionValueB: string
  stepsA: Step[]
  stepsB: Step[]
}

export async function patchQuestion({
  questionId,
  optionIdA,
  optionIdB,
  optionValueA,
  optionValueB,
  title,
  stepsA,
  stepsB,
}: PatchQuestionBody) {
  const response = await api.patch(`/question/${questionId}`, {
    optionIdA,
    optionIdB,
    optionValueA,
    optionValueB,
    title,
    stepsA,
    stepsB,
  })

  return response.data
}
