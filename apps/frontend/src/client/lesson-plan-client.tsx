'use client'

import { getAxisList } from '@/api/axis/get-axis-list'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery } from '@tanstack/react-query'
import { HomeIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { LessonPlanProvider } from '@/contexts/lesson-plan-context'
import LessonPlanMenu from '@/components/lesson-plan/lesson-plan-menu'
import LessonPlanContent from '@/components/lesson-plan/lesson-plan-content'
import { useUser } from '@/hooks/use-user'
import OnBoarding from '@/components/lesson-plan/onboarding'

const APPROACH_ID = 'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105'

export default function LessonPlanClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lessonPlanId = searchParams.get('lessonPlanId')
  const { user } = useUser()

  const {
    data: axisList,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['axisList', APPROACH_ID],
    queryFn: () => getAxisList({ approachId: APPROACH_ID }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
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

  if (!axisList || axisList.length === 0) {
    return <p>Nenhum eixo encontrado.</p>
  }

  return (
    <LessonPlanProvider
      axisIds={axisList.map((axis) => axis.id)}
      approachId={APPROACH_ID}
      lessonPlanId={lessonPlanId}
      currentUserId={user?.id}
    >
      <div className="flex justify-between">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.back()}
            className="cursor-pointer"
          >
            Voltar
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <OnBoarding />
      </div>

      {isFetching && <p>Atualizando dados...</p>}

      <Tabs defaultValue="tab-1" className="w-full h-[calc(100vh-280px)]">
        <div className="flex items-center">
          <TabsList className="bg-card h-fit -space-x-px p-0 shadow-xs rtl:space-x-reverse mx-auto">
            {axisList.map((axis, index) => (
              <TabsTrigger
                key={axis.id}
                value={`tab-${index + 1}`}
                className="cursor-pointer data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border px-8 py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
              >
                {axis.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <LessonPlanMenu />
        </div>

        {axisList.map((axis, index) => (
          <LessonPlanContent
            key={axis.id}
            axisId={axis.id}
            tabValue={`tab-${index + 1}`}
          />
        ))}
      </Tabs>
    </LessonPlanProvider>
  )
}
