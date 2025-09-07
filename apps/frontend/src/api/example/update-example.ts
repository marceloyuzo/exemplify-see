import { api } from '@/lib/axios'

interface UpdateExampleProps {
  id: string
  formData: FormData
}

export async function updateExample({ formData, id }: UpdateExampleProps) {
  const response = await api.patch(`/example/${id}`, formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
