import { useState, useCallback } from 'react'
import { useLessonPlanQuestions } from './use-lesson-plan-questions'
import {
  createLessonPlan,
  LessonPlanAxis,
} from '@/api/lesson-plan/create-lesson-plan'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export interface UseLessonPlanManagerReturn {
  // Estado dos formulários por eixo
  axisForms: Record<string, ReturnType<typeof useLessonPlanQuestions>>

  // Estado do formulário de salvar
  title: string
  description: string
  setTitle: (title: string) => void
  setDescription: (description: string) => void

  // Ações
  saveLessonPlan: () => Promise<void>
  resetAllForms: () => void

  // Estados de loading
  isSaving: boolean

  // Computed values
  isAnyFormCompleted: boolean
  totalCompletedForms: number
  totalForms: number
}

export function useLessonPlanManager(
  axisIds: string[],
  approachId: string,
  axisForms: Record<string, ReturnType<typeof useLessonPlanQuestions>>,
): UseLessonPlanManagerReturn {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const queryClient = useQueryClient()

  // Mutation para salvar o plano de aula
  const { mutateAsync: saveLessonPlanMutation, isPending: isSaving } =
    useMutation({
      mutationFn: createLessonPlan,
      onSuccess: () => {
        toast.success('Plano de aula salvo com sucesso!')
        queryClient.invalidateQueries({ queryKey: ['lesson-plans'] })
      },
      onError: (error) => {
        console.error('Erro ao salvar plano de aula:', error)
        toast.error('Erro ao salvar plano de aula. Tente novamente.')
      },
    })

  // Função para salvar o plano de aula
  const saveLessonPlan = useCallback(async () => {
    if (!title.trim()) {
      toast.error('Por favor, insira um título para o plano de aula')
      return
    }

    // Preparar os dados dos eixos
    const axes: LessonPlanAxis[] = []

    for (const axisId of axisIds) {
      const formData = axisForms[axisId]

      if (formData?.currentQuestions?.length > 0) {
        const answers = []

        for (const question of formData.currentQuestions) {
          const answerId = formData.currentAnswers[question.id]
          if (answerId) {
            // Buscar os steps da resposta selecionada
            const steps = formData.getStepsForAnswer(question.id, answerId)

            answers.push({
              questionId: question.id,
              answerId,
              steps: steps.map((step, index) => ({
                title: step.title,
                description: step.description,
                order: step.order || index,
              })),
            })
          }
        }

        if (answers.length > 0) {
          axes.push({
            axisId,
            answers,
          })
        }
      }
    }

    if (axes.length === 0) {
      toast.error(
        'Nenhum eixo foi preenchido. Complete pelo menos um eixo antes de salvar.',
      )
      return
    }

    try {
      await saveLessonPlanMutation({
        title: title.trim(),
        description: description.trim() || undefined,
        approachId,
        axes,
      })

      // Limpar formulários após salvar com sucesso
      resetAllForms()
    } catch (error) {
      // O erro já é tratado no onError da mutation
    }
  }, [
    title,
    description,
    approachId,
    axisIds,
    axisForms,
    saveLessonPlanMutation,
  ])

  // Função para resetar todos os formulários
  const resetAllForms = useCallback(() => {
    setTitle('')
    setDescription('')
    Object.values(axisForms).forEach((form) => {
      if (form?.resetForm) {
        form.resetForm()
      }
    })
  }, [axisForms])

  // Computed values
  const isAnyFormCompleted = Object.values(axisForms).some(
    (form) => form?.isCompleted,
  )
  const totalCompletedForms = Object.values(axisForms).filter(
    (form) => form?.isCompleted,
  ).length
  const totalForms = axisIds.length

  return {
    axisForms,
    title,
    description,
    setTitle,
    setDescription,
    saveLessonPlan,
    resetAllForms,
    isSaving,
    isAnyFormCompleted,
    totalCompletedForms,
    totalForms,
  }
}
