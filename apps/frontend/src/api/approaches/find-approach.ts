import { api } from '@/lib/axios'
import { AxisItem } from './get-approach-details'

interface FindApproachBody {
  page: number
  perPage: number
  orderBy: string
  approachName?: string
}

export interface FindApproachResponse {
  data: {
    id: string
    title: string
    axis: AxisItem[]
    createdAt: string
    updatedAt: string
  }[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findApproach({
  page,
  perPage,
  approachName,
  orderBy,
}: FindApproachBody) {
  const response = await api.get<FindApproachResponse>('/approach', {
    params: {
      page,
      perPage,
      approachName,
      orderBy,
    },
    withCredentials: true,
  })

  return response.data
}
