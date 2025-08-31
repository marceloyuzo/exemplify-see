'use client'

import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { Button } from '@/components/ui/button'
import { useSingleParam } from '@/utils/single-param'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HomeIcon } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@/hooks/use-user'
import { useState } from 'react'
import { getLessonPlanDetailed } from '@/api/lesson-plan/get-lesson-plan-detailed'
import LessonPlanDetailedHeader from '@/components/lesson-plan/lesson-plan-detailed-header'
import LessonPlanDetailedContent from '@/components/lesson-plan/lesson-plan-detailed-content'
import LessonPlanDetailedMetadata from '@/components/lesson-plan/lesson-plan-detailed-metadata'
import LessonPlanDeleteDialog from '@/components/lesson-plan/lesson-plan-dialogs/lesson-plan-delete-dialog'

export default function ExampleDetailedPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = useSingleParam(params.planoId)
  const { user } = useUser()
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false)

  const {
    data: lessonPlanData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lesson-plan', lessonId],
    queryFn: () =>
      getLessonPlanDetailed({
        lessonPlanId: lessonId,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  })

  if (!lessonPlanData) {
    return
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-164px)]">
        Carregando exemplo...
      </div>
    )
  }

  if (isError || !lessonPlanData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-164px)] text-red-500">
        Ocorreu um erro ao carregar o exemplo.
      </div>
    )
  }

  const createdAtFormatted = lessonPlanData?.createdAt
    ? format(new Date(lessonPlanData.createdAt), "d 'de' MMMM 'de' yyyy", {
        locale: ptBR,
      })
    : ''

  const updatedAtFormatted = lessonPlanData?.updatedAt
    ? format(new Date(lessonPlanData.updatedAt), "d 'de' MMMM 'de' yyyy", {
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
    { label: 'Planos de Aula', href: '/repositorio/planos-de-aula' },
    { label: lessonPlanData?.title || 'Carregando...', isCurrent: true },
  ]

  return (
    <div className="min-h-[calc(100vh-164px)] flex flex-col">
      <section className="mb-6">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.push('/repositorio/planos-de-aula')}
            className="cursor-pointer"
          >
            Voltar
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </section>

      {user?.id === lessonPlanData.user?.id && (
        <div className="mb-4 flex gap-4 justify-end">
          <Button
            variant={'destructive'}
            onClick={() => setOpenDeleteDialog(true)}
          >
            Excluir Exemplo
          </Button>
          <LessonPlanDeleteDialog
            lessonPlanId={lessonId}
            open={openDeleteDialog}
            setOpen={setOpenDeleteDialog}
          />
        </div>
      )}

      <LessonPlanDetailedHeader
        title={lessonPlanData.title}
        rating={lessonPlanData.averageRating}
        createdAt={createdAtFormatted}
        updatedAt={updatedAtFormatted}
      />

      <div className="mt-2 grid grid-cols-4 gap-2 flex-1">
        <LessonPlanDetailedContent
          description={lessonPlanData.description}
          contents={lessonPlanData.contents}
          materials={lessonPlanData.materials}
          priorKnowledge={lessonPlanData.priorKnowledge}
        />

        <LessonPlanDetailedMetadata
          user={lessonPlanData.user}
          topic={lessonPlanData.topic?.title}
          exampleType={lessonPlanData.exampleLabel}
          complexity={lessonPlanData.complexityLabel}
          subject={lessonPlanData.subject?.title}
          modality={lessonPlanData.modalityLabel}
          workload={lessonPlanData.workload}
          year={lessonPlanData.year}
        />
      </div>
    </div>
  )
}
