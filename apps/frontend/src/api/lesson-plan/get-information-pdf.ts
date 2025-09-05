import { api } from '@/lib/axios'

export interface GetLessonPlanDetailedParams {
  lessonPlanId: string
}

export async function getInformationPdf({
  lessonPlanId,
}: GetLessonPlanDetailedParams) {
  const response = await api.get(`/lesson-plan/${lessonPlanId}/pdf`, {
    withCredentials: true,
  })

  return response.data
}
