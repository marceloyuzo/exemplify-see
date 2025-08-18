import { api } from '@/lib/axios'

export interface EditApproachProps {
  id: string
  title: string
}

export async function editApproach({ id, title }: EditApproachProps) {
  const response = await api.put(
    `/approach/${id}`,
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
