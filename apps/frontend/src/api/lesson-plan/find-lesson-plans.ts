import { api } from '@/lib/axios'

interface FindLessonPlansParams {
  page: number
  perPage: number
  orderBy: string
  myLessons: boolean
  lessonPlanName?: string
  subjectId?: string
  topicId?: string
  complexity?: string
  example?: string
}

export interface FindLessonPlansResponse {
  data: {
    id: string
    title: string
    description: string
    createdAt: string
    user: {
      id: string
      name: string
      photoURL: string
    }
    averageRating: number | null
  }[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findLessonPlans({
  page,
  perPage,
  lessonPlanName,
  orderBy,
  myLessons,
  complexity,
  example,
  subjectId,
  topicId,
}: FindLessonPlansParams) {
  const response = await api.get<FindLessonPlansResponse>('/lesson-plan', {
    params: {
      page,
      perPage,
      lessonPlanName,
      orderBy,
      myLessons,
      complexity,
      example,
      subjectId,
      topicId,
    },
    withCredentials: true,
  })

  return response.data
}
