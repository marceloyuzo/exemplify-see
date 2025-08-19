// hooks/useLessonPlanQuestions.ts
import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getQuestionRoot } from '@/api/questions/get-question-root'
import { getQuestionNext } from '@/api/questions/get-question-next'
import { Step } from '@/components/question/question-dialog'

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

export interface UseLessonPlanQuestionsReturn {
  // Form control
  form: ReturnType<typeof useForm<FormData>>

  // Questions data
  currentQuestions: Question[]
  questionsHistory: string[]

  // Steps data
  currentSteps: Step[]

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
  getStepsForAnswer: (questionId: string, answerId: string) => Step[]
}

export function useLessonPlanQuestions(
  axisId: string,
): UseLessonPlanQuestionsReturn {
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([])
  const [questionsHistory, setQuestionsHistory] = useState<string[]>([])
  const [currentSteps, setCurrentSteps] = useState<Step[]>([])

  const form = useForm<FormData>({
    defaultValues: {},
  })

  const { watch, setValue, reset, getValues } = form

  const { data: dataQuestionRoot, isLoading: isLoadingRoot } = useQuery({
    queryKey: ['question-root', axisId],
    queryFn: () => getQuestionRoot({ axisId }),
    enabled: !!axisId,
  })

  useEffect(() => {
    if (dataQuestionRoot) {
      setCurrentQuestions([dataQuestionRoot])
      setQuestionsHistory([])
    }
  }, [dataQuestionRoot])

  const watchedAnswers = watch()
  const lastAnsweredQuestionId = questionsHistory[questionsHistory.length - 1]
  const lastSelectedAnswerId = lastAnsweredQuestionId
    ? watchedAnswers[lastAnsweredQuestionId]
    : null

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

  // Função helper para extrair steps de uma resposta
  const getStepsForAnswer = useCallback(
    (questionId: string, answerId: string): Step[] => {
      const question = currentQuestions.find((q) => q.id === questionId)
      const selectedTransition = question?.transitionsFromHere.find(
        (t) => t.answerValue.id === answerId,
      )

      if (
        selectedTransition?.answerValue?.steps &&
        selectedTransition.answerValue.steps.length > 0
      ) {
        // Ordena os steps por order
        return [...selectedTransition.answerValue.steps].sort(
          (a, b) => a.order - b.order,
        )
      }

      return []
    },
    [currentQuestions],
  )

  // Monitora mudanças nas respostas
  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name && values[name]) {
        const questionId = name
        const answerId = values[name]

        // Extrai os steps da resposta selecionada usando a função helper
        const stepsFromAnswer = getStepsForAnswer(questionId, answerId)

        // Atualiza os steps atuais
        setCurrentSteps(stepsFromAnswer)

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

        // Atualiza o histórico
        setQuestionsHistory(questionsToKeep)

        // Remove perguntas subsequentes da lista atual
        setCurrentQuestions((prev) => {
          const filtered = prev.filter(
            (q) =>
              questionsToKeep.includes(q.id) || q.id === dataQuestionRoot?.id,
          )

          return filtered
        })

        // Limpa valores de perguntas que foram removidas
        const allQuestionIds = currentQuestions.map((q) => q.id)
        const questionsToRemove = allQuestionIds.filter(
          (qId) =>
            !questionsToKeep.includes(qId) && qId !== dataQuestionRoot?.id,
        )

        questionsToRemove.forEach((qId) => {
          setValue(qId, '')
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [
    watch,
    questionsHistory,
    currentQuestions,
    setValue,
    dataQuestionRoot,
    currentSteps,
    getStepsForAnswer,
  ])

  // Actions
  const resetForm = () => {
    reset()
    setCurrentQuestions(dataQuestionRoot ? [dataQuestionRoot] : [])
    setQuestionsHistory([])
    setCurrentSteps([])
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

      // Limpa os steps ao voltar (eles serão recalculados quando uma nova resposta for selecionada)
      setCurrentSteps([])
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

  return {
    // Form control
    form,

    // Questions data
    currentQuestions,
    questionsHistory,

    // Steps data
    currentSteps,

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
    getStepsForAnswer,
  }
}
