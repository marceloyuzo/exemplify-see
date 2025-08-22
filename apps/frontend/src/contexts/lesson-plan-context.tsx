'use client'

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getQuestionRoot } from '@/api/questions/get-question-root'
import { getQuestionNext } from '@/api/questions/get-question-next'
import {
  createLessonPlan,
  LessonPlanAxis,
} from '@/api/lesson-plan/create-lesson-plan'
import { toast } from 'sonner'
import { Step } from '@/components/question/question-dialog'

// Schema para o formulário de metadados do plano de aula
const lessonPlanMetadataSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  complexity: z.string().optional(),
  example: z.string().optional(),
  isPublic: z.boolean(),
})

export type LessonPlanMetadataFormData = z.infer<
  typeof lessonPlanMetadataSchema
>

export interface Question {
  id: string
  title: string
  transitionsFromHere: {
    toQuestionId: string | null
    answerValue: {
      id: string
      title: string
      steps: Step[]
    }
  }[]
}

export interface FormData {
  [questionId: string]: string
}

export interface AxisState {
  currentQuestions: Question[]
  questionsHistory: string[]
  currentSteps: Step[]
  isLoadingRoot: boolean
  isLoadingNext: boolean
}

export interface AxisData extends AxisState {
  isCompleted: boolean
  totalQuestions: number
  currentAnswers: FormData
  getQuestionByIndex: (index: number) => Question | undefined
  isQuestionAnswered: (questionId: string) => boolean
  getSelectedAnswerText: (questionId: string) => string | undefined
  getStepsForAnswer: (questionId: string, answerId: string) => Step[]
}

interface LessonPlanContextType {
  // Form control para respostas das perguntas
  questionsForm: ReturnType<typeof useForm<FormData>>

  // Form control para metadados do plano de aula
  metadataForm: ReturnType<typeof useForm<LessonPlanMetadataFormData>>

  // Axis data
  getAxisData: (axisId: string) => AxisData

  // Actions per axis
  updateAxisAnswer: (
    axisId: string,
    questionId: string,
    answerId: string,
  ) => void
  resetAxis: (axisId: string) => void
  goToPreviousQuestion: (axisId: string) => void

  // Lesson plan management
  saveLessonPlan: () => Promise<void>
  resetAllForms: () => void

  // Global states
  isSaving: boolean
  isAnyFormCompleted: boolean
  totalCompletedForms: number
  totalForms: number
}

const LessonPlanContext = createContext<LessonPlanContextType | null>(null)

interface LessonPlanProviderProps {
  children: ReactNode
  axisIds: string[]
  approachId: string
}

export function LessonPlanProvider({
  children,
  axisIds,
  approachId,
}: LessonPlanProviderProps) {
  const queryClient = useQueryClient()

  // Form para respostas das perguntas
  const questionsForm = useForm<FormData>({
    defaultValues: {},
  })

  // Form para metadados do plano de aula
  const metadataForm = useForm<LessonPlanMetadataFormData>({
    resolver: zodResolver(lessonPlanMetadataSchema),
    defaultValues: {
      title: '',
      description: '',
      isPublic: false,
    },
  })

  const { watch, setValue, reset, getValues } = questionsForm

  // Estados para cada eixo
  const [axisStates, setAxisStates] = useState<Record<string, AxisState>>({})

  // Inicializar estados dos eixos
  useEffect(() => {
    const initialStates: Record<string, AxisState> = {}
    axisIds.forEach((axisId) => {
      initialStates[axisId] = {
        currentQuestions: [],
        questionsHistory: [],
        currentSteps: [],
        isLoadingRoot: true,
        isLoadingNext: false,
      }
    })
    setAxisStates(initialStates)
  }, [axisIds])

  // Queries para perguntas root de cada eixo
  const rootQueries = useQuery({
    queryKey: ['question-roots', axisIds],
    queryFn: async () => {
      const promises = axisIds.map(async (axisId) => {
        const question = await getQuestionRoot({ axisId })
        return {
          axisId,
          question: question || null,
        }
      })
      return await Promise.all(promises)
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
    enabled: axisIds.length > 0,
  })

  // Atualizar estados quando as perguntas root chegarem
  useEffect(() => {
    if (rootQueries.data) {
      setAxisStates((prevStates) => {
        const newStates = { ...prevStates }
        console.log(rootQueries.data)
        rootQueries.data.forEach(({ axisId, question }) => {
          newStates[axisId] = {
            ...prevStates[axisId],
            currentQuestions: question ? [question] : [],
            questionsHistory: [],
            currentSteps: [],
            isLoadingRoot: false,
          }
        })
        return newStates
      })
    }
  }, [rootQueries.data])

  // Função para obter steps de uma resposta
  const getStepsForAnswer = useCallback(
    (axisId: string, questionId: string, answerId: string): Step[] => {
      const axisState = axisStates[axisId]
      if (!axisState) return []

      const question = axisState.currentQuestions.find(
        (q) => q.id === questionId,
      )
      const selectedTransition = question?.transitionsFromHere.find(
        (t) => t.answerValue.id === answerId,
      )

      if (
        selectedTransition?.answerValue?.steps &&
        selectedTransition.answerValue.steps.length > 0
      ) {
        return [...selectedTransition.answerValue.steps].sort(
          (a, b) => a.order - b.order,
        )
      }

      return []
    },
    [axisStates],
  )

  // Query para próximas perguntas (dinâmica por eixo)
  const [nextQuestionQueries, setNextQuestionQueries] = useState<
    Record<string, string>
  >({})

  // Monitora mudanças nas respostas
  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name || !values[name]) return

      const questionId = name
      const answerId = values[name]

      // Encontrar qual eixo contém essa pergunta
      let targetAxisId: string | null = null
      Object.entries(axisStates).forEach(([axisId, state]) => {
        if (state.currentQuestions.some((q) => q.id === questionId)) {
          targetAxisId = axisId
        }
      })

      if (!targetAxisId) return

      updateAxisAnswer(targetAxisId, questionId, answerId)
    })

    return () => subscription.unsubscribe()
  }, [watch, axisStates])

  // Atualizar resposta de um eixo específico
  const updateAxisAnswer = useCallback(
    (axisId: string, questionId: string, answerId: string) => {
      setAxisStates((prevStates) => {
        const axisState = prevStates[axisId]
        if (!axisState) return prevStates

        // Extrair steps da resposta
        const stepsFromAnswer = getStepsForAnswer(axisId, questionId, answerId)

        // Encontrar índice da pergunta no histórico
        const currentIndex = axisState.questionsHistory.indexOf(questionId)

        let questionsToKeep: string[]
        if (currentIndex !== -1) {
          questionsToKeep = axisState.questionsHistory.slice(
            0,
            currentIndex + 1,
          )
        } else {
          questionsToKeep = [...axisState.questionsHistory, questionId]
        }

        // Filtrar perguntas atuais
        const filteredQuestions = axisState.currentQuestions.filter(
          (q) =>
            questionsToKeep.includes(q.id) ||
            q.id === axisState.currentQuestions[0]?.id,
        )

        // Limpar valores de perguntas removidas
        const allQuestionIds = axisState.currentQuestions.map((q) => q.id)
        const questionsToRemove = allQuestionIds.filter(
          (qId) =>
            !questionsToKeep.includes(qId) &&
            qId !== axisState.currentQuestions[0]?.id,
        )

        questionsToRemove.forEach((qId) => {
          setValue(qId, '')
        })

        // Verificar se precisa buscar próxima pergunta
        const question = axisState.currentQuestions.find(
          (q) => q.id === questionId,
        )
        const selectedTransition = question?.transitionsFromHere.find(
          (t) => t.answerValue.id === answerId,
        )

        if (selectedTransition?.toQuestionId) {
          // Marcar para buscar próxima pergunta
          setNextQuestionQueries((prev) => ({
            ...prev,
            [axisId]: answerId,
          }))
        }

        return {
          ...prevStates,
          [axisId]: {
            ...axisState,
            questionsHistory: questionsToKeep,
            currentQuestions: filteredQuestions,
            currentSteps: stepsFromAnswer,
          },
        }
      })
    },
    [getStepsForAnswer, setValue],
  )

  // Query para próximas perguntas
  const { data: nextQuestionsData } = useQuery({
    queryKey: ['next-questions', nextQuestionQueries],
    queryFn: async () => {
      const promises = Object.entries(nextQuestionQueries).map(
        async ([axisId, answerId]) => ({
          axisId,
          question: await getQuestionNext({ answerId }),
        }),
      )
      return await Promise.all(promises)
    },
    enabled: Object.keys(nextQuestionQueries).length > 0,
  })

  // Adicionar próximas perguntas quando chegarem
  useEffect(() => {
    if (nextQuestionsData && nextQuestionsData.length > 0) {
      setAxisStates((prevStates) => {
        const newStates = { ...prevStates }
        nextQuestionsData.forEach(({ axisId, question }) => {
          if (
            newStates[axisId] &&
            !newStates[axisId].currentQuestions.find(
              (q) => q.id === question.id,
            )
          ) {
            newStates[axisId] = {
              ...newStates[axisId],
              currentQuestions: [
                ...newStates[axisId].currentQuestions,
                question,
              ],
            }
          }
        })
        return newStates
      })

      // Limpar queries processadas
      setNextQuestionQueries({})
    }
  }, [nextQuestionsData])

  // Função para obter dados de um eixo específico
  const getAxisData = useCallback(
    (axisId: string): AxisData => {
      const axisState = axisStates[axisId]
      const currentAnswers = getValues()

      if (!axisState) {
        return {
          currentQuestions: [],
          questionsHistory: [],
          currentSteps: [],
          isLoadingRoot: true,
          isLoadingNext: false,
          isCompleted: false,
          totalQuestions: 0,
          currentAnswers: {},
          getQuestionByIndex: () => undefined,
          isQuestionAnswered: () => false,
          getSelectedAnswerText: () => undefined,
          getStepsForAnswer: () => [],
        }
      }

      const isCompleted =
        axisState.currentQuestions.length > 0 &&
        axisState.currentQuestions.every((q) => currentAnswers[q.id]) &&
        !axisState.isLoadingNext

      return {
        ...axisState,
        isCompleted,
        totalQuestions: axisState.currentQuestions.length,
        currentAnswers,
        getQuestionByIndex: (index: number) =>
          axisState.currentQuestions[index],
        isQuestionAnswered: (questionId: string) =>
          !!currentAnswers[questionId],
        getSelectedAnswerText: (questionId: string) => {
          const answerId = currentAnswers[questionId]
          if (!answerId) return undefined

          const question = axisState.currentQuestions.find(
            (q) => q.id === questionId,
          )
          const selectedTransition = question?.transitionsFromHere.find(
            (t) => t.answerValue.id === answerId,
          )
          return selectedTransition?.answerValue.title
        },
        getStepsForAnswer: (questionId: string, answerId: string) =>
          getStepsForAnswer(axisId, questionId, answerId),
      }
    },
    [axisStates, getValues, getStepsForAnswer],
  )

  // Resetar um eixo específico
  const resetAxis = useCallback(
    (axisId: string) => {
      const axisState = axisStates[axisId]
      if (!axisState) return

      // Limpar valores do form para este eixo
      axisState.currentQuestions.forEach((q) => {
        setValue(q.id, '')
      })

      // Resetar estado do eixo
      setAxisStates((prevStates) => ({
        ...prevStates,
        [axisId]: {
          ...prevStates[axisId],
          currentQuestions: prevStates[axisId].currentQuestions.slice(0, 1), // Manter apenas a primeira pergunta
          questionsHistory: [],
          currentSteps: [],
        },
      }))
    },
    [axisStates, setValue],
  )

  // Voltar pergunta anterior
  const goToPreviousQuestion = useCallback(
    (axisId: string) => {
      const axisState = axisStates[axisId]
      if (!axisState || axisState.questionsHistory.length === 0) return

      const previousQuestionId =
        axisState.questionsHistory[axisState.questionsHistory.length - 1]
      setValue(previousQuestionId, '')

      const newHistory = axisState.questionsHistory.slice(0, -1)

      setAxisStates((prevStates) => ({
        ...prevStates,
        [axisId]: {
          ...prevStates[axisId],
          questionsHistory: newHistory,
          currentQuestions: prevStates[axisId].currentQuestions.filter(
            (q) =>
              newHistory.includes(q.id) ||
              q.id === prevStates[axisId].currentQuestions[0]?.id,
          ),
          currentSteps: [],
        },
      }))
    },
    [axisStates, setValue],
  )

  // Mutation para salvar plano
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

  // Salvar plano de aula
  const saveLessonPlan = useCallback(async () => {
    // Validar formulário de metadados
    const metadataValid = await metadataForm.trigger()
    if (!metadataValid) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const metadataValues = metadataForm.getValues()
    const axes: LessonPlanAxis[] = []

    for (const axisId of axisIds) {
      const axisData = getAxisData(axisId)

      if (axisData.currentQuestions.length > 0) {
        const answers = []

        for (const question of axisData.currentQuestions) {
          const answerId = axisData.currentAnswers[question.id]
          if (answerId) {
            const steps = axisData.getStepsForAnswer(question.id, answerId)

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
      console.log(metadataValues)
      await saveLessonPlanMutation({
        title: metadataValues.title,
        description: metadataValues.description || undefined,
        subjectId: metadataValues.subjectId,
        complexity: metadataValues.complexity,
        example: metadataValues.example,
        isPublic: metadataValues.isPublic,
        approachId,
        axes,
      })

      resetAllForms()
    } catch (error) {
      // Erro já tratado no onError
    }
  }, [metadataForm, approachId, axisIds, getAxisData, saveLessonPlanMutation])

  // Resetar todos os formulários
  const resetAllForms = useCallback(() => {
    metadataForm.reset()
    reset()

    // Resetar todos os eixos
    axisIds.forEach((axisId) => {
      resetAxis(axisId)
    })
  }, [axisIds, resetAxis, reset, metadataForm])

  // Computed values
  const isAnyFormCompleted = Object.values(axisStates).some((state) => {
    const axisData = getAxisData(
      Object.keys(axisStates).find((id) => axisStates[id] === state) || '',
    )
    return axisData.isCompleted
  })

  const totalCompletedForms = axisIds.filter((axisId) => {
    const axisData = getAxisData(axisId)
    return axisData.isCompleted
  }).length

  const contextValue: LessonPlanContextType = {
    questionsForm,
    metadataForm,
    getAxisData,
    updateAxisAnswer,
    resetAxis,
    goToPreviousQuestion,
    saveLessonPlan,
    resetAllForms,
    isSaving,
    isAnyFormCompleted,
    totalCompletedForms,
    totalForms: axisIds.length,
  }

  return (
    <LessonPlanContext.Provider value={contextValue}>
      {children}
    </LessonPlanContext.Provider>
  )
}

export function useLessonPlanContext() {
  const context = useContext(LessonPlanContext)
  if (!context) {
    throw new Error(
      'useLessonPlanContext must be used within LessonPlanProvider',
    )
  }
  return context
}
