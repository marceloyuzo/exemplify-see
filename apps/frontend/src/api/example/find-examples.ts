import { api } from '@/lib/axios'

interface FindExamplesParams {
  page: number
  perPage: number
  orderBy: string
  exampleName?: string
  topicId?: string
  exampleType?: string
}

export interface ExampleResponse {
  id: string
  title: string
  description: string
  reference: string[]
  type: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    photoURL: string
  }
  topic: {
    id: string
    title: string
  }
  averageRating: number | null
}

export interface FindExamplesResponse {
  data: ExampleResponse[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findExamples({
  page,
  perPage,
  exampleName,
  orderBy,
  topicId,
  exampleType,
}: FindExamplesParams) {
  const response = await api.get<FindExamplesResponse>('/example', {
    params: {
      page,
      perPage,
      exampleName,
      orderBy,
      topicId,
      exampleType,
    },
    withCredentials: true,
  })

  return response.data
}
