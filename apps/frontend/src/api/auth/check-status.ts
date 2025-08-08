import { api } from '@/lib/axios'

export default async function CheckStatus() {
  const response = await api.get('/auth/check', {
    withCredentials: true,
  })

  return response.data
}
