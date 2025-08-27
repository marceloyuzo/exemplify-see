import { api } from '@/lib/axios'

interface CreateExampleBody {
  title: string
  description: string
  topicId: string
  modelsId: string[]
  exampleType: string
  references: {
    value: string
  }[]
}

export async function createExample({
  title,
  description,
  exampleType,
  modelsId,
  references,
  topicId,
}: CreateExampleBody) {
  const response = await api.post(
    '/example',
    {
      title,
      description,
      exampleType,
      modelsId,
      references,
      topicId,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
