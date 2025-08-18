import { api } from '@/lib/axios'

export interface DeleteApproachProps {
  id: string
}

export async function deleteApproach({ id }: DeleteApproachProps) {
  const response = await api.delete(`/approach/${id}`, {
    withCredentials: true,
  })

  return response
}
