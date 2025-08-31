import { api } from '@/lib/axios'

export async function createExample(formData: FormData) {
  const response = await api.post('/example', formData, {
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}
