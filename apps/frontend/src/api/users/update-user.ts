import { api } from '@/lib/axios'

export interface UpdateUserProps {
  id: string
  name: string
  email: string
  role?: 'user' | 'admin'
}

export async function updateUser({ email, id, name, role }: UpdateUserProps) {
  const response = await api.put(`/users/update`, {
    id,
    email,
    name,
    role,
  })

  return response
}
