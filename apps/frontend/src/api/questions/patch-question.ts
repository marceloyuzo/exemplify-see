import { Step } from '@/components/question/question-dialog'
import { api } from '@/lib/axios'

export interface PatchQuestionBody {
  questionId: string
  title: string
  optionIdA: string
  optionValueA: string
  optionIdB: string
  optionValueB: string
  optionIdC?: string
  optionValueC?: string
  stepsA: Step[]
  stepsB: Step[]
  stepsC?: Step[]
}

export async function patchQuestion({
  questionId,
  optionIdA,
  optionIdB,
  optionValueA,
  optionValueB,
  optionIdC,
  optionValueC,
  title,
  stepsA,
  stepsB,
  stepsC,
}: PatchQuestionBody) {
  const payload = {
    optionIdA,
    optionIdB,
    optionValueA,
    optionValueB,
    title,
    stepsA,
    stepsB,
  }

  if (optionValueC && optionValueC.trim()) {
    Object.assign(payload, {
      optionIdC: optionIdC || '',
      optionValueC: optionValueC.trim(),
      stepsC: stepsC || [],
    })
  }

  const response = await api.patch(`/question/${questionId}`, payload)

  return response.data
}
