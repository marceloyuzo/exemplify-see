import { api } from '@/lib/axios'

export interface UpdateModelBody {
  modelId: string
  title: string
}

export async function updateModel({ modelId, title }: UpdateModelBody) {
  const response = await api.patch(
    `/model/${modelId}`,
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
