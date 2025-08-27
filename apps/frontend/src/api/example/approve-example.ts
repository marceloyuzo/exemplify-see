import { api } from '@/lib/axios'

interface ApproveExampleParam {
  id: string
}

export async function approveExample({ id }: ApproveExampleParam) {
  const response = await api.post(
    `/example/${id}/approve`,
    {},
    {
      withCredentials: true,
    },
  )

  return response.data
}
