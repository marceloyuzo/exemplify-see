import { api } from '@/lib/axios'

export interface GetLessonPlanDetailedParams {
  lessonPlanId: string
}

export interface GetLessonPlanByIdResponse {
  id: string
  title: string
  description: string | null
  subjectId: string | null
  topicId: string | null
  complexity: string | null
  example: string | null
  isPublic: boolean
  userId: string
  approachId: string
  createdAt: string
  updatedAt: string | null

  axes: {
    id: string
    axisId: string
    answers: {
      id: string
      questionId: string
      answerId: string
      steps: {
        id: string
        title: string
        description: string
        order: number
      }[]
    }[]
  }[]

  user?: {
    id: string
    name: string
    photoURL: string
  }
  approach?: {
    id: string
    title: string
  }
  subject?: {
    id: string
    title: string
  }
  topic?: {
    id: string
    title: string
  }

  complexityLabel: string
  exampleLabel: string
}

export async function getLessonPlanDetailed({
  lessonPlanId,
}: GetLessonPlanDetailedParams) {
  const response = await api.get<GetLessonPlanByIdResponse>(
    `/lesson-plan/${lessonPlanId}`,
    {
      withCredentials: true,
    },
  )

  return response.data
}
