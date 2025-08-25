import { api } from '@/lib/axios'

export interface CreateModelBody {
  title: string
}

export async function createModel({ title }: CreateModelBody) {
  const response = await api.post(
    '/model',
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
