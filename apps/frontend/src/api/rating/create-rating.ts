import { api } from '@/lib/axios'

interface CreateRatingBody {
  exampleId: string
  rate: number
  comment?: string
}

export async function createRating({
  exampleId,
  rate,
  comment,
}: CreateRatingBody) {
  const response = await api.post(
    `/rating/example/${exampleId}`,
    {
      rate,
      comment,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
