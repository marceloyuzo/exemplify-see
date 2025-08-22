import { api } from '@/lib/axios'

export interface GetHighlightsLessonParams {
  myRepository: boolean
}

export interface GetHighlightsLessonResponse {
  id: string
  title: string
  description: string
  createdAt: string
  user: {
    id: string
    name: string
    photoURL: string
  }
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
