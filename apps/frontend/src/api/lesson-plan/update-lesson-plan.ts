import { api } from '@/lib/axios'
import { LessonPlanAxis } from './create-lesson-plan'

interface UpdateLessonPlanProps {
  lessonPlanId?: string
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

export interface LessonPlanResponse {
  id: string
}

export async function updateLessonPlan({
  lessonPlanId,
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
}: UpdateLessonPlanProps): Promise<LessonPlanResponse> {
  const response = await api.patch(
    `/lesson-plan/${lessonPlanId}`,
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
