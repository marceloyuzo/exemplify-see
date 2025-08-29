import { api } from '@/lib/axios'

interface FindRatingsParams {
  page: number
  perPage: number
  exampleId: string
}

export interface CreateRatingResponse {
  data: {
    id: string
    comment?: string
    rate: number
    user: {
      id: string
      name: string
      photoURL: string
    }
    createdAt: string
  }[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findRatings({
  page,
  perPage,
  exampleId,
}: FindRatingsParams) {
  const response = await api.get<CreateRatingResponse>('/rating', {
    params: {
      page,
      perPage,
      exampleId,
    },
    withCredentials: true,
  })

  return response.data
}
