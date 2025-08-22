import { api } from '@/lib/axios'

export interface GetLessonPlanDetailedParams {
  lessonPlanId: string
}

interface Axes {
  id: string
  lessonPlanId: string
  axisId: string
  createdAt: string
  updatedAt: string
}

export interface GetHighlightsLessonResponse {
  id: string
  title: string
  description: string | null
  complexity: string | null
  example: string | null
  isPublic: boolean
  approachId: string
  createdAt: string
  updatedAt: string
  axes: Axes[]
  subject: {
    id: string
    title: string
  } | null
  topic: {
    id: string
    title: string
  } | null
  user: {
    id: string
    name: string
    photoURL: string
  }
  complexityLabel: string
  exampleLabel: string
}

export async function getLessonPlanDetailed({
  lessonPlanId,
}: GetLessonPlanDetailedParams) {
  const response = await api.get<GetHighlightsLessonResponse>(
    `/lesson-plan/${lessonPlanId}`,
    {
      withCredentials: true,
    },
  )

  return response.data
}
