import { api } from '@/lib/axios'

export interface CreateSubjectBody {
  title: string
}

export async function createSubject({ title }: CreateSubjectBody) {
  const response = await api.post(
    '/subject',
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
