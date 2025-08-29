import { api } from '@/lib/axios'

export interface DeleteRatingProps {
  id: string
}

export async function deleteRating({ id }: DeleteRatingProps) {
  const response = await api.delete(`/rating/${id}`, {
    withCredentials: true,
  })

  return response
}
