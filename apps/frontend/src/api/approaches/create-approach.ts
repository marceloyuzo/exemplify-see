import { api } from '@/lib/axios'

export interface CreateApproachProps {
  title: string
}

export async function createApproach({ title }: CreateApproachProps) {
  const response = await api.post(
    '/approach',
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response
}
