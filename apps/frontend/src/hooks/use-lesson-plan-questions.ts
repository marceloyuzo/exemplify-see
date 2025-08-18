// hooks/useLessonPlanQuestions.ts
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getQuestionRoot } from '@/api/questions/get-question-root'
import { getQuestionNext } from '@/api/questions/get-question-next'

export interface Step {
  id: string
  title: string
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
  [questionId: string]: string // answerId selecionado
}

export interface UseLessonPlanQuestionsReturn {
  // Form control
  form: ReturnType<typeof useForm<FormData>>

  // Questions data
  currentQuestions: Question[]
  questionsHistory: string[]

  // Steps data
  // allSteps: Step[]
  stepsByQuestion: Record<string, Step[]>

  // Loading states
  isLoadingRoot: boolean
  isLoadingNext: boolean

  // Actions
  resetForm: () => void
  goToPreviousQuestion: () => void

  // Computed values
  isCompleted: boolean
  currentAnswers: FormData
  totalQuestions: number

  // Utils
  getQuestionByIndex: (index: number) => Question | undefined
  isQuestionAnswered: (questionId: string) => boolean
  getSelectedAnswerText: (questionId: string) => string | undefined
  getStepsForQuestion: (questionId: string) => Step[]
}

export function useLessonPlanQuestions(
  axisId: string,
): UseLessonPlanQuestionsReturn {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [questionsHistory, setQuestionsHistory] = useState<string[]>([])
  // const [allSteps, setAllSteps] = useState<Step[]>([])
  const [stepsByQuestion, setStepsByQuestion] = useState<
    Record<string, Step[]>
  >({})

  const form = useForm<FormData>({
    defaultValues: {},
  })

  const { watch, setValue, reset, getValues } = form

  // Query para buscar a pergunta raiz
  const { data: dataQuestionRoot, isLoading: isLoadingRoot } = useQuery({
    queryKey: ['question-root', axisId],
    queryFn: () => getQuestionRoot({ axisId }),
    enabled: !!axisId,
  })

  // Inicializa com a pergunta raiz
  useEffect(() => {
    if (dataQuestionRoot) {
      setCurrentQuestions([dataQuestionRoot])
      setQuestionsHistory([])
    }
  }, [dataQuestionRoot])

  // Query para buscar próxima pergunta baseada na resposta
  const watchedAnswers = watch()
  const lastAnsweredQuestionId = questionsHistory[questionsHistory.length - 1]
  const lastSelectedAnswerId = lastAnsweredQuestionId
    ? watchedAnswers[lastAnsweredQuestionId]
    : null

  // Verifica se a última resposta selecionada tem uma próxima pergunta
  const shouldFetchNext = () => {
    if (!lastSelectedAnswerId || !lastAnsweredQuestionId) return false

    const lastQuestion = currentQuestions.find(
      (q) => q.id === lastAnsweredQuestionId,
    )
    const selectedTransition = lastQuestion?.transitionsFromHere.find(
      (t) => t.answerValue.id === lastSelectedAnswerId,
    )

    return !!selectedTransition?.toQuestionId
  }

  const { data: nextQuestion, isLoading: isLoadingNext } = useQuery({
    queryKey: ['next-question', lastSelectedAnswerId],
    queryFn: () => getQuestionNext({ answerId: lastSelectedAnswerId! }),
    enabled: shouldFetchNext(),
  })

  // Adiciona a próxima pergunta quando ela chega
  useEffect(() => {
    if (
      nextQuestion &&
      !currentQuestions.find((q) => q.id === nextQuestion.id)
    ) {
      setCurrentQuestions((prev) => [...prev, nextQuestion])
    }
  }, [nextQuestion, currentQuestions])

  // Função para consolidar todos os steps das perguntas respondidas
  // const updateAllSteps = () => {
  //   const currentAnswers = getValues()
  //   const allStepsArray: Step[] = []

  //   // Processa as perguntas na ordem do histórico
  //   questionsHistory.forEach((questionId) => {
  //     if (stepsByQuestion[questionId]) {
  //       allStepsArray.push(...stepsByQuestion[questionId])
  //     }
  //   })

  //   // Remove duplicatas baseado no ID e ordena
  //   const uniqueSteps = allStepsArray
  //     .filter(
  //       (step, index, array) =>
  //         array.findIndex((s) => s.id === step.id) === index,
  //     )
  //     .sort((a, b) => a.order - b.order)

  //   setAllSteps(uniqueSteps)
  //   console.log('📊 Steps consolidados atualizados:', uniqueSteps)
  // }

  // Atualiza os steps consolidados sempre que stepsByQuestion mudar
  // useEffect(() => {
  //   updateAllSteps()
  // }, [stepsByQuestion, questionsHistory])

  // Monitora mudanças nas respostas
  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name && values[name]) {
        const questionId = name
        const answerId = values[name]

        console.log('🔄 Resposta alterada:', { questionId, answerId })

        // Encontra a transição correspondente
        const currentQuestion = currentQuestions.find(
          (q) => q.id === questionId,
        )
        const selectedTransition = currentQuestion?.transitionsFromHere.find(
          (t) => t.answerValue.id === answerId,
        )

        console.log('📋 Transição encontrada:', selectedTransition)

        // Atualiza os steps para esta pergunta
        if (selectedTransition?.answerValue.steps) {
          const steps = [...selectedTransition.answerValue.steps].sort(
            (a, b) => a.order - b.order,
          )

          setStepsByQuestion((prev) => ({
            ...prev,
            [questionId]: steps,
          }))

          // console.log('📝 Steps atualizados para pergunta:', {
          //   questionId,
          //   steps,
          // })
        }

        // Encontra o índice da pergunta atual no histórico
        const currentIndex = questionsHistory.indexOf(questionId)

        // Define quais perguntas devem ser mantidas
        let questionsToKeep: string[]

        if (currentIndex !== -1) {
          // Se a pergunta já estava no histórico, mantém até ela
          questionsToKeep = questionsHistory.slice(0, currentIndex + 1)
        } else {
          // Se é uma pergunta nova, adiciona ao histórico
          questionsToKeep = [...questionsHistory, questionId]
        }

        // console.log('📝 Histórico anterior:', questionsHistory)
        // console.log('✅ Perguntas a manter:', questionsToKeep)

        // Atualiza o histórico
        setQuestionsHistory(questionsToKeep)

        // Remove perguntas subsequentes da lista atual
        setCurrentQuestions((prev) => {
          const filtered = prev.filter(
            (q) =>
              questionsToKeep.includes(q.id) || q.id === dataQuestionRoot?.id,
          )
          // console.log(
          //   '🏠 Perguntas atuais após filtragem:',
          //   filtered.map((q) => ({ id: q.id, title: q.title })),
          // )
          return filtered
        })

        // Limpa valores de perguntas que foram removidas
        const allQuestionIds = currentQuestions.map((q) => q.id)
        const questionsToRemove = allQuestionIds.filter(
          (qId) =>
            !questionsToKeep.includes(qId) && qId !== dataQuestionRoot?.id,
        )

        // console.log('🗑️ Perguntas a remover valores:', questionsToRemove)

        questionsToRemove.forEach((qId) => {
          setValue(qId, '')
          // Remove os steps das perguntas removidas
          setStepsByQuestion((prev) => {
            const updated = { ...prev }
            delete updated[qId]
            return updated
          })
        })

        // Atualiza o array consolidado de todos os steps
        // updateAllSteps()

        // Log do resultado final
        // console.log(
        //   '🎯 Próxima pergunta será buscada?',
        //   !!selectedTransition?.toQuestionId,
        // )
      }
    })

    return () => subscription.unsubscribe()
  }, [watch, questionsHistory, currentQuestions, setValue, dataQuestionRoot])

  // Actions
  const resetForm = () => {
    reset()
    setCurrentQuestions(dataQuestionRoot ? [dataQuestionRoot] : [])
    setQuestionsHistory([])
    // setAllSteps([])
    setStepsByQuestion({})
  }

  const goToPreviousQuestion = () => {
    if (questionsHistory.length > 0) {
      const previousQuestionId = questionsHistory[questionsHistory.length - 1]
      setValue(previousQuestionId, '')

      // Remove a última pergunta do histórico
      const newHistory = questionsHistory.slice(0, -1)
      setQuestionsHistory(newHistory)

      // Remove as perguntas subsequentes
      setCurrentQuestions((prev) =>
        prev.filter(
          (q) => newHistory.includes(q.id) || q.id === dataQuestionRoot?.id,
        ),
      )

      // Remove os steps da pergunta removida
      setStepsByQuestion((prev) => {
        const updated = { ...prev }
        delete updated[previousQuestionId]
        return updated
      })
    }
  }

  // Computed values
  const currentAnswers = getValues()
  const totalQuestions = currentQuestions.length

  const isCompleted =
    currentQuestions.length > 0 &&
    currentQuestions.every((q) => currentAnswers[q.id]) &&
    !isLoadingNext

  // Utils
  const getQuestionByIndex = (index: number): Question | undefined => {
    return currentQuestions[index]
  }

  const isQuestionAnswered = (questionId: string): boolean => {
    return !!currentAnswers[questionId]
  }

  const getSelectedAnswerText = (questionId: string): string | undefined => {
    const answerId = currentAnswers[questionId]
    if (!answerId) return undefined

    const question = currentQuestions.find((q) => q.id === questionId)
    const selectedTransition = question?.transitionsFromHere.find(
      (t) => t.answerValue.id === answerId,
    )

    return selectedTransition?.answerValue.title
  }

  const getStepsForQuestion = (questionId: string): Step[] => {
    return stepsByQuestion[questionId] || []
  }

  return {
    // Form control
    form,

    // Questions data
    currentQuestions,
    questionsHistory,

    // Steps data
    // allSteps,
    stepsByQuestion,

    // Loading states
    isLoadingRoot,
    isLoadingNext,

    // Actions
    resetForm,
    goToPreviousQuestion,

    // Computed values
    isCompleted,
    currentAnswers,
    totalQuestions,

    // Utils
    getQuestionByIndex,
    isQuestionAnswered,
    getSelectedAnswerText,
    getStepsForQuestion,
  }
}
