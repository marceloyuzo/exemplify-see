'use client'

import { getAxisList } from '@/api/axis/get-axis-list'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import LessonPlanContent from '@/components/lesson-plan/lesson-plan-content'
import LessonPlanMenu from '@/components/lesson-plan/lesson-plan-menu'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LessonPlanPage() {
  const router = useRouter()

  const {
    data: axisList,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['axisList', '75b68e1f-14c9-46b3-b0d9-cc9ddfaaed0f'],
    queryFn: () =>
      getAxisList({
        approachId: '75b68e1f-14c9-46b3-b0d9-cc9ddfaaed0f',
      }),
  })

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Plano de Aula', isCurrent: true },
  ]

  if (isLoading) {
    return <p>Carregando eixos...</p>
  }

  if (isError) {
    return <p>Ocorreu um erro ao carregar os eixos.</p>
  }

  return (
    <>
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.push(`/`)}
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {isFetching && <p>Atualizando dados...</p>}
      <Tabs defaultValue="tab-1" className="w-full h-[calc(100vh-280px)]">
        <div className="flex items-center">
          <TabsList className="bg-card h-fit -space-x-px p-0 shadow-xs rtl:space-x-reverse mx-auto">
            {axisList?.map((axis, index) => (
              <TabsTrigger
                key={axis.id}
                value={`tab-${index + 1}`}
                className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border px-8 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
              >
                {axis.title}
              </TabsTrigger>
            ))}
          </TabsList>

          <LessonPlanMenu />
        </div>

        {axisList?.map((axis, index) => (
          <LessonPlanContent
            axisId={axis.id}
            tabValue={`tab-${index + 1}`}
            key={axis.id}
          />
        ))}
      </Tabs>
    </>
  )
}
