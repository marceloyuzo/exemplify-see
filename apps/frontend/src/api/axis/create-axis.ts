import { api } from '@/lib/axios'

export interface CreateAxisProps {
  title: string
  approachId: string
}

export async function createAxis({ approachId, title }: CreateAxisProps) {
  const response = await api.post(
    '/axis',
    {
      title,
      approachId,
    },
    {
      withCredentials: true,
    },
  )

  return response
}
