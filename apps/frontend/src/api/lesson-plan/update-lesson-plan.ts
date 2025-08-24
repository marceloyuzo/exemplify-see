import { api } from '@/lib/axios'
import { LessonPlanAxis } from './create-lesson-plan'

interface UpdateLessonPlanProps {
  lessonPlanId?: string
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

export async function updateLessonPlan({
  lessonPlanId,
  title,
  description,
  approachId,
  axes,
  isPublic,
  complexity,
  example,
  subjectId,
  topicId,
}: UpdateLessonPlanProps) {
  const response = await api.patch(
    `/lesson-plan/${lessonPlanId}`,
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
