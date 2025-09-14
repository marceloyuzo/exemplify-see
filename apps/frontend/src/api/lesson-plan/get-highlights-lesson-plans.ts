import { api } from '@/lib/axios'

export interface GetHighlightsLessonParams {
  myRepository: boolean
}

export interface GetHighlightsLessonResponse {
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

export async function getHighlightsLessonPlans({
  myRepository,
}: GetHighlightsLessonParams) {
  const response = await api.get<GetHighlightsLessonResponse[]>(
    '/lesson-plan/highlights',
    {
      params: {
        myRepository,
      },
      withCredentials: true,
    },
  )

  return response.data
}
