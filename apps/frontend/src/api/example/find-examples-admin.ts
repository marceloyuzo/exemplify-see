import { api } from '@/lib/axios'

interface FindExamplesAdminParams {
  page: number
  perPage: number
  orderBy: string
  exampleName?: string
  topicId?: string
  exampleType?: string
}

export interface ExampleResponseAdmin {
  id: string
  title: string
  description: string
  reference: string[]
  type: string
  isApprove: boolean
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
}

export interface FindExamplesAdminResponse {
  data: ExampleResponseAdmin[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export async function findExamplesAdmin({
  page,
  perPage,
  exampleName,
  orderBy,
  topicId,
  exampleType,
}: FindExamplesAdminParams) {
  const response = await api.get<FindExamplesAdminResponse>('/example/admin', {
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
