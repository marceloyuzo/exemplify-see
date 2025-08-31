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
  year: string
  workload: string
  modality: string
  contents: string[]
  materials: string[]
  priorKnowledge?: string
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
  contents,
  materials,
  modality,
  workload,
  year,
  priorKnowledge,
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
      contents,
      materials,
      modality,
      workload,
      year,
      priorKnowledge,
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
