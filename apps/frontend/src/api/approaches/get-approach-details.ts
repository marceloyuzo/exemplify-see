import { api } from '@/lib/axios'

interface GetApproachDetailsProps {
  approachId: string
}

export interface AxisItem {
  id: string
  title: string
}

export interface GetApproachDetailsResponse {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  axis: AxisItem[]
}

export async function getApproachDetails({
  approachId,
}: GetApproachDetailsProps) {
  const response = await api.get<GetApproachDetailsResponse>(
    `/approach/${approachId}`,
    {
      withCredentials: true,
    },
  )

  return response.data
}
