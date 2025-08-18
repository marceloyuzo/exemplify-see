import { api } from '@/lib/axios'

export interface DeleteAxisProps {
  id: string
}

export async function deleteAxis({ id }: DeleteAxisProps) {
  const response = await api.delete(`/axis/${id}`, {
    withCredentials: true,
  })

  return response
}
