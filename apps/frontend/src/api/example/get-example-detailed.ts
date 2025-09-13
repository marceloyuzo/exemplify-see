import { api } from '@/lib/axios'

export interface GetExampleDetailedParams {
  exampleId: string
}

export interface ExampleModel {
  model: {
    id: string
    title: string
  }
}

interface Author {
  id: string
  name: string
  photoURL: string
}

interface Topic {
  id: string
  title: string
}

export interface Attachment {
  id: string
  title: string
  url: string
  type: string
}

export interface GetExampleDetailedResponse {
  id: string
  title: string
  description: string
  references: string[]
  exampleModel: ExampleModel[]
  type: 'correct' | 'erroneous' | 'both'
  createdAt: string
  updatedAt: string
  author: Author
  topic: Topic
  attachment: Attachment[]
  averageRating: number | null
}

export async function getExampleDetailed({
  exampleId,
}: GetExampleDetailedParams) {
  const response = await api.get<GetExampleDetailedResponse>(
    `/example/${exampleId}`,
    {
      withCredentials: true,
    },
  )

  return response.data
}
