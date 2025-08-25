import { api } from '@/lib/axios'

export interface DeleteExampleProps {
  id: string
}

export async function deleteExample({ id }: DeleteExampleProps) {
  const response = await api.delete(`/example/${id}`, {
    withCredentials: true,
  })

  return response
}
