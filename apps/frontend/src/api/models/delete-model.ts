import { api } from '@/lib/axios'

export interface DeleteModelParam {
  modelId: string
}

export async function deleteModel({ modelId }: DeleteModelParam) {
  const response = await api.delete(`/model/${modelId}`, {
    withCredentials: true,
  })

  return response
}
