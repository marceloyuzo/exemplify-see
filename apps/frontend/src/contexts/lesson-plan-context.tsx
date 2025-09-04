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
import { getLessonPlanDetailed } from '@/api/lesson-plan/get-lesson-plan-detailed'
import {
  LessonPlanResponse,
  updateLessonPlan,
} from '@/api/lesson-plan/update-lesson-plan'
import { useRouter, useSearchParams } from 'next/navigation'
import { generatePdf } from '@/api/lesson-plan/generate-pdf'

const lessonPlanMetadataSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  subjectId: z.string().min(1, 'Disciplina é obrigatório'),
  topicId: z.string().min(1, 'Tema é obrigatório'),
  complexity: z.string().optional(),
  example: z.string().optional(),
  year: z.string().min(1, 'Ano/Semestre é obrigatório'),
  workload: z.string().min(1, 'Carga horária é obrigatório'),
  modality: z.string().min(1, 'Modalidade é obrigatório'),
  contents: z
    .array(z.string().min(1, 'O valor do conteúdo é obrigatório.'))
    .min(1, 'Pelo menos um conteúdo é obrigatória.'),
  materials: z
    .array(z.string().min(1, 'O valor do conteúdo é obrigatório.'))
    .min(1, 'Pelo menos um conteúdo é obrigatória.'),
  priorKnowledge: z.string().optional(),
  isPublic: z.boolean(),
})

export type LessonPlanMetadataFormData = z.infer<
  typeof lessonPlanMetadataSchema
>

interface Step {
  title: string
  description?: string
  order: number
}

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
  hasMoreQuestions: boolean
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
  saveLessonPlan: () => Promise<LessonPlanResponse | undefined>
  resetAllForms: () => void
  generateLessonPlanPdf: () => Promise<void>

  isGeneratingPdf: boolean

  // Global states
  isSaving: boolean
  isAnyFormCompleted: boolean
  totalCompletedForms: number
  totalForms: number
  isDataLoaded: boolean
  isEditing: boolean
  isOwner: boolean
  originalAuthorId: string | null
  currentUserId?: string // Você precisa passar isso como prop
}

const LessonPlanContext = createContext<LessonPlanContextType | null>(null)

interface LessonPlanProviderProps {
  children: ReactNode
  axisIds: string[]
  approachId: string
  lessonPlanId: string | null
  currentUserId?: string // Nova prop necessária
}

export function LessonPlanProvider({
  children,
  axisIds,
  approachId,
  lessonPlanId,
  currentUserId,
}: LessonPlanProviderProps) {
  const queryClient = useQueryClient()
  const isEditing = !!lessonPlanId

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
      subjectId: '',
      topicId: '',
      isPublic: false,
      contents: [''],
      materials: [''],
    },
  })

  const { watch, setValue, reset, getValues } = questionsForm

  // Estados para cada eixo
  const [axisStates, setAxisStates] = useState<Record<string, AxisState>>({})
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [originalAuthorId, setOriginalAuthorId] = useState<string | null>(null)

  const {
    data: existingLessonPlan,
    isLoading: isLoadingExisting,
    isError,
  } = useQuery({
    queryKey: ['lesson-plan', lessonPlanId],
    queryFn: () =>
      getLessonPlanDetailed({
        lessonPlanId: lessonPlanId as string,
      }),
    enabled: isEditing,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (isError) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('lessonPlanId')
      router.replace(`?${params.toString()}`)
    }
  }, [isError, router, searchParams])

  // Verificar se o usuário é o dono do plano
  const isOwner = isEditing ? originalAuthorId === currentUserId : true // Se não está editando, sempre pode salvar como novo

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
        hasMoreQuestions: false,
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

  useEffect(() => {
    const shouldInitialize =
      Object.keys(axisStates).length === 0 ||
      !axisIds.every((id) => axisStates[id])

    if (shouldInitialize) {
      const initialStates: Record<string, AxisState> = {}
      axisIds.forEach((axisId) => {
        initialStates[axisId] = axisStates[axisId] || {
          currentQuestions: [],
          questionsHistory: [],
          currentSteps: [],
          isLoadingRoot: true,
          isLoadingNext: false,
        }
      })
      setAxisStates(initialStates)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axisIds])

  useEffect(() => {
    setAxisStates((prevStates) => {
      const newStates = { ...prevStates }

      axisIds.forEach((axisId) => {
        if (newStates[axisId]) {
          newStates[axisId] = {
            ...newStates[axisId],
            isLoadingRoot: rootQueries.isLoading || rootQueries.isFetching,
          }
        }
      })

      return newStates
    })

    if (rootQueries.data && !rootQueries.isLoading && !rootQueries.isFetching) {
      setAxisStates((prevStates) => {
        const newStates = { ...prevStates }

        rootQueries.data.forEach(({ axisId, question }) => {
          if (newStates[axisId]) {
            const currentQuestions = question ? [question] : []
            const hasChanged =
              newStates[axisId].currentQuestions.length !==
                currentQuestions.length ||
              newStates[axisId].currentQuestions[0]?.id !==
                currentQuestions[0]?.id

            if (hasChanged || newStates[axisId].isLoadingRoot) {
              newStates[axisId] = {
                ...newStates[axisId],
                currentQuestions,
                questionsHistory:
                  newStates[axisId].questionsHistory.length === 0
                    ? []
                    : newStates[axisId].questionsHistory,
                currentSteps:
                  newStates[axisId].currentSteps.length === 0
                    ? []
                    : newStates[axisId].currentSteps,
                isLoadingRoot: false,
                hasMoreQuestions: false,
              }
            }
          }
        })

        return newStates
      })
    }
  }, [rootQueries.data, rootQueries.isLoading, rootQueries.isFetching, axisIds])

  useEffect(() => {
    if (existingLessonPlan && !isDataLoaded) {
      setOriginalAuthorId(existingLessonPlan.userId)

      // Carregar metadados
      metadataForm.reset({
        title: existingLessonPlan.title,
        description: existingLessonPlan.description || '',
        subjectId: existingLessonPlan.subjectId || undefined,
        topicId: existingLessonPlan.topicId || undefined,
        complexity: existingLessonPlan.complexity || undefined,
        example: existingLessonPlan.example || undefined,
        isPublic: existingLessonPlan.isPublic,
        contents: existingLessonPlan.contents,
        materials: existingLessonPlan.materials,
        modality: existingLessonPlan.modality,
        priorKnowledge: existingLessonPlan.priorKnowledge || undefined,
        workload: existingLessonPlan.workload,
        year: existingLessonPlan.year,
      })

      // Carregar respostas das perguntas
      const questionsData: FormData = {}
      existingLessonPlan.axes.forEach((axis) => {
        axis.answers.forEach((answer) => {
          questionsData[answer.questionId] = answer.answerId
        })
      })

      // Definir valores das respostas
      Object.entries(questionsData).forEach(([questionId, answerId]) => {
        setValue(questionId, answerId)
      })

      setIsDataLoaded(true)
    }
  }, [existingLessonPlan, isDataLoaded, metadataForm, setValue])

  const reconstructAxisData = useCallback(async () => {
    if (!existingLessonPlan || !rootQueries.data) return

    const newAxisStates: Record<string, AxisState> = {}

    for (const axisId of axisIds) {
      const rootQuestion = rootQueries.data.find(
        (r) => r.axisId === axisId,
      )?.question
      const axisData = existingLessonPlan.axes.find((a) => a.axisId === axisId)

      if (!rootQuestion) {
        continue
      }

      const currentQuestions = [rootQuestion]
      const questionsHistory: string[] = []
      let currentSteps: Step[] = []

      if (axisData && axisData.answers && axisData.answers.length > 0) {
        // Reconstruir a cadeia de perguntas
        let currentQuestion = rootQuestion
        questionsHistory.push(currentQuestion.id)

        for (let i = 0; i < axisData.answers.length; i++) {
          const answer = axisData.answers[i]

          // Verificar se a resposta corresponde à pergunta atual
          if (answer.questionId === currentQuestion.id) {
            // Se não é a última resposta, buscar próxima pergunta
            if (i < axisData.answers.length - 1) {
              try {
                const nextQuestion = await getQuestionNext({
                  answerId: answer.answerId,
                })

                if (nextQuestion) {
                  // Verificar se a próxima pergunta corresponde à próxima resposta
                  const nextAnswer = axisData.answers[i + 1]
                  if (nextQuestion.id === nextAnswer.questionId) {
                    currentQuestions.push(nextQuestion)
                    questionsHistory.push(nextQuestion.id)
                    currentQuestion = nextQuestion
                  } else {
                    break
                  }
                } else {
                  break
                }
              } catch (error) {
                break
              }
            } else {
              // É a última resposta, carregar steps
              if (answer.steps && answer.steps.length > 0) {
                currentSteps = answer.steps.map((step) => ({
                  title: step.title,
                  description: step.description,
                  order: step.order,
                }))
              }
            }
          } else {
            break
          }
        }
      }

      newAxisStates[axisId] = {
        currentQuestions,
        questionsHistory,
        currentSteps,
        isLoadingRoot: false,
        isLoadingNext: false,
        hasMoreQuestions: false,
      }
    }

    setAxisStates(newAxisStates)
  }, [existingLessonPlan, rootQueries.data, axisIds])

  useEffect(() => {
    const reconstructData = async () => {
      if (isEditing && isDataLoaded && rootQueries.data && existingLessonPlan) {
        await reconstructAxisData()
      }
    }

    reconstructData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, isDataLoaded, rootQueries.data, existingLessonPlan])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

        let hasMoreQuestions = false
        if (selectedTransition?.toQuestionId) {
          // Marcar para buscar próxima pergunta
          setNextQuestionQueries((prev) => ({
            ...prev,
            [axisId]: answerId,
          }))
          hasMoreQuestions = true
        }

        return {
          ...prevStates,
          [axisId]: {
            ...axisState,
            questionsHistory: questionsToKeep,
            currentQuestions: filteredQuestions,
            currentSteps: stepsFromAnswer,
            hasMoreQuestions,
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
              hasMoreQuestions: false,
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
          hasMoreQuestions: false,
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
        !axisState.isLoadingNext &&
        !axisState.hasMoreQuestions

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
          hasMoreQuestions: false,
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
          hasMoreQuestions: false,
        },
      }))
    },
    [axisStates, setValue],
  )

  // Determinar qual mutation usar baseado na propriedade
  const shouldUpdate = isEditing && isOwner
  const shouldCreate = !isEditing || !isOwner

  // Mutation para salvar plano
  const { mutateAsync: saveLessonPlanMutation, isPending: isSaving } =
    useMutation({
      mutationFn: shouldUpdate ? updateLessonPlan : createLessonPlan,
      onSuccess: () => {
        const action = shouldUpdate ? 'atualizado' : 'salvo'
        toast.success(`Plano de aula ${action} com sucesso!`)

        queryClient.invalidateQueries({ queryKey: ['lesson-plans'] })
        if (shouldUpdate) {
          queryClient.invalidateQueries({
            queryKey: ['lesson-plan', lessonPlanId],
          })
        }
      },
      onError: (error) => {
        toast.error(
          `Erro ao salvar plano de aula. Tente novamente. Error: ${error}`,
        )
      },
    })

  // Mutation para gerar PDF
  const { mutateAsync: generatePdfAsync, isPending: isGeneratingPdf } =
    useMutation({
      mutationFn: generatePdf,
      onSuccess: () => {
        toast.success('PDF gerado com sucesso!')
      },
      onError: (error) => {
        toast.error(`Erro ao gerar PDF. Tente novamente. ${error}`)
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

      if (axisData.isCompleted) {
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
      const payload = {
        title: metadataValues.title,
        description: metadataValues.description || undefined,
        subjectId: metadataValues.subjectId,
        topicId: metadataValues.topicId,
        complexity: metadataValues.complexity,
        year: metadataValues.year,
        workload: metadataValues.workload,
        modality: metadataValues.modality,
        contents: metadataValues.contents,
        materials: metadataValues.materials,
        priorKnowledge: metadataValues.priorKnowledge,
        example: metadataValues.example,
        isPublic: metadataValues.isPublic,
        approachId,
        axes,
        ...(shouldUpdate && { lessonPlanId }),
      }

      const lessonPlanResponse = await saveLessonPlanMutation(payload)

      if (shouldCreate) {
        resetAllForms()
      }

      return lessonPlanResponse
    } catch (error) {
      // Erro já tratado no onError
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    metadataForm,
    approachId,
    axisIds,
    getAxisData,
    saveLessonPlanMutation,
    shouldUpdate,
    shouldCreate,
    lessonPlanId,
  ])

  const generateLessonPlanPdf = useCallback(async () => {
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

      if (axisData.isCompleted) {
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
        'Nenhum eixo foi preenchido. Complete pelo menos um eixo antes de gerar o PDF.',
      )
      return
    }

    const payload = {
      title: metadataValues.title,
      description: metadataValues.description || undefined,
      subjectId: metadataValues.subjectId,
      topicId: metadataValues.topicId,
      complexity: metadataValues.complexity,
      year: metadataValues.year,
      workload: metadataValues.workload,
      modality: metadataValues.modality,
      contents: metadataValues.contents,
      materials: metadataValues.materials,
      priorKnowledge: metadataValues.priorKnowledge,
      example: metadataValues.example,
      isPublic: metadataValues.isPublic,
      approachId,
      axes,
      ...(isEditing && { lessonPlanId }),
    }
    try {
      await generatePdfAsync(payload)
    } catch (error) {
      // Erro já tratado no onError do mutation
    }
  }, [
    metadataForm,
    approachId,
    axisIds,
    getAxisData,
    generatePdfAsync,
    isEditing,
    lessonPlanId,
  ])

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
    generateLessonPlanPdf,
    resetAllForms,
    isSaving: isSaving || isLoadingExisting,
    isAnyFormCompleted,
    totalCompletedForms,
    totalForms: axisIds.length,
    isEditing,
    isOwner,
    originalAuthorId,
    currentUserId,
    isDataLoaded: isDataLoaded && !isLoadingExisting,
    isGeneratingPdf,
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
