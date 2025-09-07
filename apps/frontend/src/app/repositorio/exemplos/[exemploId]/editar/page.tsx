'use client'

import { getExampleDetailed } from '@/api/example/get-example-detailed'
import FormExemplo from '@/components/example/example-form'
import { useSingleParam } from '@/utils/single-param'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export default function FormEditarExemplo() {
  const params = useParams()
  const exampleId = useSingleParam(params.exemploId)

  const {
    data: exampleData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['example', exampleId],
    queryFn: () =>
      getExampleDetailed({
        exampleId,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })

  if (!exampleData) {
    return
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-164px)]">
        Carregando exemplo...
      </div>
    )
  }

  if (isError || !exampleData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-164px)] text-red-500">
        Ocorreu um erro ao carregar o exemplo.
      </div>
    )
  }

  return (
    <>
      <FormExemplo initialData={exampleData} isEditing={true} />
    </>
  )
}
