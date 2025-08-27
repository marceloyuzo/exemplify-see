'use client'

import { getExampleDetailed } from '@/api/example/get-example-detailed'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import ExampleDetailedContent from '@/components/example/example-detailed-content'
import ExampleDetailedHeader from '@/components/example/example-detailed-header'
import ExampleDetailedMetadata from '@/components/example/example-detailed-metadata'
import { Button } from '@/components/ui/button'
import { useSingleParam } from '@/utils/single-param'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HomeIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function ExampleDetailedPage() {
  const router = useRouter()
  const params = useParams()
  const exampleId = useSingleParam(params.exemploId)

  const { data: exampleData } = useQuery({
    queryKey: ['example', exampleId],
    queryFn: () =>
      getExampleDetailed({
        exampleId,
      }),
  })

  if (!exampleData) {
    return
  }

  const createdAtFormatted = exampleData?.createdAt
    ? format(new Date(exampleData.createdAt), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : ''

  const updatedAtFormatted = exampleData?.updatedAt
    ? format(new Date(exampleData.updatedAt), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : ''

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Repositório', href: '#' },
    { label: 'Exemplos', href: '/repositorio/exemplos' },
    { label: exampleData?.title || 'Carregando...', isCurrent: true },
  ]

  return (
    <div className="min-h-[calc(100vh-164px)] flex flex-col">
      <section className="mb-6">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.push('/repositorio/exemplos')}
            className="cursor-pointer"
          >
            Voltar
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </section>

      <ExampleDetailedHeader
        title={exampleData.title}
        createdAt={createdAtFormatted}
        updatedAt={updatedAtFormatted}
      />

      <div className="mt-2 grid grid-cols-4 gap-2 flex-1">
        <ExampleDetailedContent
          description={exampleData.description}
          references={exampleData.references}
        />
        <ExampleDetailedMetadata
          user={exampleData.author}
          exampleType={exampleData.type}
          topic={exampleData.topic.title}
          exampleModel={exampleData.exampleModel}
        />
      </div>
    </div>
  )
}
