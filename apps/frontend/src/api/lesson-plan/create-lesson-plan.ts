import { api } from '@/lib/axios'

export interface LessonPlanStep {
  title: string
  description: string
  order: number
}

export interface LessonPlanAnswer {
  questionId: string
  answerId: string
  steps: LessonPlanStep[]
}

export interface LessonPlanAxis {
  axisId: string
  answers: LessonPlanAnswer[]
}

export interface CreateLessonPlanProps {
  title: string
  description?: string
  subjectId?: string
  topicId?: string
  complexity?: string
  example?: string
  isPublic: boolean
  approachId: string
  axes: LessonPlanAxis[]
}

export async function createLessonPlan({
  title,
  description,
  approachId,
  axes,
  isPublic,
  complexity,
  example,
  subjectId,
  topicId,
}: CreateLessonPlanProps) {
  const response = await api.post(
    '/lesson-plan',
    {
      title,
      description,
      approachId,
      axes,
      isPublic,
      complexity,
      example,
      subjectId,
      topicId,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
