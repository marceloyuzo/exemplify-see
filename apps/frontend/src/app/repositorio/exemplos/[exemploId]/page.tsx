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
import { useUser } from '@/hooks/use-user'
import ExampleDeleteDialog from '@/components/example/example-delete-dialog'
import { useState } from 'react'

export default function ExampleDetailedPage() {
  const router = useRouter()
  const params = useParams()
  const exampleId = useSingleParam(params.exemploId)
  const { user } = useUser()
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

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

      {user?.id === exampleData.author.id && (
        <div className="mb-4 flex gap-4 justify-end">
          <Button
            variant={'destructive'}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Excluir Exemplo
          </Button>
          <ExampleDeleteDialog
            exampleToDelete={exampleData}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
          />

          <Button
            variant={'outline'}
            onClick={() =>
              router.push(`/repositorio/exemplos/${exampleId}/editar`)
            }
          >
            Editar Exemplo
          </Button>
        </div>
      )}

      <ExampleDetailedHeader
        title={exampleData.title}
        rating={exampleData.averageRating}
        createdAt={createdAtFormatted}
        updatedAt={updatedAtFormatted}
      />
      <div className="mt-2 grid grid-cols-4 gap-2 flex-1">
        <ExampleDetailedContent
          description={exampleData.description}
          references={exampleData.references}
          attachments={exampleData.attachment}
          authorId={exampleData.author.id}
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
