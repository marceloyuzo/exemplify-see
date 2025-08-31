import { api } from '@/lib/axios'

interface CreateRatingBody {
  exampleId?: string
  lessonPlanId?: string
  rate: number
  comment?: string
}

export async function createRating({
  exampleId,
  lessonPlanId,
  rate,
  comment,
}: CreateRatingBody) {
  const response = await api.post(
    `/rating`,
    {
      exampleId,
      lessonPlanId,
      rate,
      comment,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
