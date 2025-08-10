import { api } from '@/lib/axios'

export interface UpdateProfileProps {
  id: string
  name: string
  email: string
}

export async function updateProfile({ email, id, name }: UpdateProfileProps) {
  const response = await api.put(`/users/update-profile/${id}`, {
    email,
    name,
  })

  return response
}
