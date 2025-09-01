import { api } from '@/lib/axios'

export async function disableFirstTime() {
  const response = await api.put(
    `/users/firstTime`,
    {},
    { withCredentials: true },
  )

  return response
}
