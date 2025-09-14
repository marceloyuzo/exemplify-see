import { api } from '@/lib/axios'

interface FindLessonPlansParams {
  page: number
  perPage: number
  orderBy: string
  lessonPlanName?: string
}

interface LessonPlanResponse {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    photoURL: string
  }
  topic: {
    id: string
    title: string
  }
  subject: {
    id: string
    title: string
  }
  example: string
  modality: string
  complexity: string
  workload: string
  year: string
  averageRating: number | null
}

export interface FindLessonPlansResponse {
  data: LessonPlanResponse[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findLessonPlansAdmin({
  page,
  perPage,
  lessonPlanName,
  orderBy,
}: FindLessonPlansParams) {
  const response = await api.get<FindLessonPlansResponse>(
    '/lesson-plan/admin',
    {
      params: {
        page,
        perPage,
        lessonPlanName,
        orderBy,
      },
      withCredentials: true,
    },
  )

  return response.data
}
