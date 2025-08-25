import { api } from '@/lib/axios'

export interface UpdateSubjectBody {
  subjectId: string
  title: string
}

export async function updateSubject({ subjectId, title }: UpdateSubjectBody) {
  const response = await api.patch(
    `/subject/${subjectId}`,
    {
      title,
    },
    {
      withCredentials: true,
    },
  )

  return response.data
}
