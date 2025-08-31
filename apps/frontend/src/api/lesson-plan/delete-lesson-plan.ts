import { api } from '@/lib/axios'

export interface DeleteLessonPlanProps {
  id: string
}

export async function deleteLessonPlan({ id }: DeleteLessonPlanProps) {
  const response = await api.delete(`/lesson-plan/${id}`, {
    withCredentials: true,
  })

  return response
}
