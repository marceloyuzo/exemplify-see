import { useState, useCallback } from 'react'
import { Step } from '@/components/question/question-dialog'
import { useLessonPlanQuestions } from './use-lesson-plan-questions'

interface LessonPlanData {
  axisId: string
  formData: FormData
  steps: Step[]
  isCompleted: boolean
}

interface SaveLessonPlanPayload {
  lessonPlan: {
    title?: string
    description?: string
    axes: {
      axisId: string
      axisTitle?: string
      answers: {
        questionId: string
        answerId: string
        questionTitle: string
        answerTitle: string
      }[]
      steps: {
        id: string
        title: string
        order: number
      }[]
    }[]
  }
}

export interface UseLessonPlanManagerReturn {
  // Data for each axis
  getAxisData: (axisId: string) => ReturnType<typeof useLessonPlanQuestions>

  // Computed values
  allAxesData: LessonPlanData[]
  isAllCompleted: boolean
  totalAxes: number
  completedAxes: number

  // Actions
  saveLessonPlan: (title?: string, description?: string) => Promise<void>

  // Loading states
  isSaving: boolean
}

export function useLessonPlanManager(
  axisIds: string[],
): UseLessonPlanManagerReturn {
  const [isSaving, setIsSaving] = useState(false)

  // Chama os hooks diretamente
  const hooksArray = axisIds.map((axisId) => ({
    axisId,
    hook: useLessonPlanQuestions(axisId),
  }))

  // Cria um map para acessar rápido pelo axisId
  const axisHooks = Object.fromEntries(
    hooksArray.map(({ axisId, hook }) => [axisId, hook]),
  )

  const getAxisData = useCallback(
    (axisId: string) => axisHooks[axisId],
    [axisHooks],
  )

  // Computed values
  const allAxesData: LessonPlanData[] = hooksArray.map(({ axisId, hook }) => ({
    axisId,
    formData: hook.currentAnswers,
    steps: hook.currentSteps,
    isCompleted: hook.isCompleted,
  }))

  const completedAxes = allAxesData.filter((data) => data.isCompleted).length
  const isAllCompleted = completedAxes === axisIds.length && axisIds.length > 0

  const saveLessonPlan = useCallback(
    async (title?: string, description?: string) => {
      setIsSaving(true)

      try {
        const payload: SaveLessonPlanPayload = {
          lessonPlan: {
            title:
              title || `Plano de Aula - ${new Date().toLocaleDateString()}`,
            description: description || 'Plano de aula gerado automaticamente',
            axes: allAxesData.map((data) => {
              const axisData = axisHooks[data.axisId]

              const answers = Object.entries(data.formData)
                .filter(([, answerId]) => answerId)
                .map(([questionId, answerId]) => {
                  const questionTitle =
                    axisData.currentQuestions.find((q) => q.id === questionId)
                      ?.title || ''
                  const answerTitle =
                    axisData.getSelectedAnswerText(questionId) || ''

                  return { questionId, answerId, questionTitle, answerTitle }
                })

              return {
                axisId: data.axisId,
                axisTitle: `Eixo ${data.axisId}`,
                answers,
                steps: data.steps.map((step) => ({
                  id: step.id,
                  title: step.title,
                  order: step.order,
                })),
              }
            }),
          },
        }

        const response = await fetch('/api/lesson-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) throw new Error('Erro ao salvar plano de aula')

        const result = await response.json()
        console.log('✅ Plano de aula salvo com sucesso:', result)
      } catch (error) {
        console.error('❌ Erro ao salvar plano de aula:', error)
        throw error
      } finally {
        setIsSaving(false)
      }
    },
    [allAxesData, axisHooks],
  )

  return {
    getAxisData,
    allAxesData,
    isAllCompleted,
    totalAxes: axisIds.length,
    completedAxes,
    saveLessonPlan,
    isSaving,
  }
}
