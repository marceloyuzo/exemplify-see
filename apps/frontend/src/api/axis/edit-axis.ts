import { api } from '@/lib/axios'

export interface EditAxisProps {
  id: string
  title: string
}

export async function editAxis({ id, title }: EditAxisProps) {
  const response = await api.patch(`/axis/${id}`, {
    title,
  })

  return response.data
}
