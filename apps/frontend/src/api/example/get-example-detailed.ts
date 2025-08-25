import { api } from '@/lib/axios'
import { ExampleResponse } from './find-examples'

export interface GetExampleDetailedParams {
  exampleId: string
}

export async function getExampleDetailed({
  exampleId,
}: GetExampleDetailedParams) {
  const response = await api.get<ExampleResponse>(`/example/${exampleId}`, {
    withCredentials: true,
  })

  return response.data
}
