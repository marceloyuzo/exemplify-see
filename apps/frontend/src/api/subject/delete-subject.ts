import { api } from '@/lib/axios'

export interface DeleteSubjectParam {
  subjectId: string
}

export async function deleteSubject({ subjectId }: DeleteSubjectParam) {
  const response = await api.delete(`/subject/${subjectId}`, {
    withCredentials: true,
  })

  return response
}
