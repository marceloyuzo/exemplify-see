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
import { useLessonPlanManager } from '@/hooks/use-lesson-plan-manager'
import { useLessonPlanQuestions } from '@/hooks/use-lesson-plan-questions'

export default function LessonPlanPage() {
  const router = useRouter()

  const {
    data: axisList,
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ['axisList', 'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105'],
    queryFn: () =>
      getAxisList({
        approachId: 'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105',
      }),
  })

  // Criar formulários individuais para cada eixo
  // Nota: Isso deve ser feito no nível do componente, não dentro de loops condicionais
  const axisForm1 = useLessonPlanQuestions(axisList?.[0]?.id || '')
  const axisForm2 = useLessonPlanQuestions(axisList?.[1]?.id || '')
  const axisForm3 = useLessonPlanQuestions(axisList?.[2]?.id || '')
  const axisForm4 = useLessonPlanQuestions(axisList?.[3]?.id || '')
  const axisForm5 = useLessonPlanQuestions(axisList?.[4]?.id || '')

  // Criar objeto com todos os formulários
  const axisForms: Record<
    string,
    ReturnType<typeof useLessonPlanQuestions>
  > = {}
  if (axisList) {
    if (axisList[0]) axisForms[axisList[0].id] = axisForm1
    if (axisList[1]) axisForms[axisList[1].id] = axisForm2
    if (axisList[2]) axisForms[axisList[2].id] = axisForm3
    if (axisList[3]) axisForms[axisList[3].id] = axisForm4
    if (axisList[4]) axisForms[axisList[4].id] = axisForm5
  }

  // Usar o hook manager para gerenciar todos os formulários
  const lessonPlanManager = useLessonPlanManager(
    axisList?.map((axis) => axis.id) || [],
    'ce2fd7bd-a7bb-4438-86c3-98f4dcb0e105',
    axisForms,
  )

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

      <LessonPlanMenu
        title={lessonPlanManager.title}
        description={lessonPlanManager.description}
        setTitle={lessonPlanManager.setTitle}
        setDescription={lessonPlanManager.setDescription}
        onSave={lessonPlanManager.saveLessonPlan}
        onReset={lessonPlanManager.resetAllForms}
        isSaving={lessonPlanManager.isSaving}
        isAnyFormCompleted={lessonPlanManager.isAnyFormCompleted}
        totalCompletedForms={lessonPlanManager.totalCompletedForms}
        totalForms={lessonPlanManager.totalForms}
      />

      {isFetching && <p>Atualizando dados...</p>}
      <Tabs defaultValue="tab-1" className="w-full h-[calc(100vh-280px)]">
        <TabsList className="bg-card h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse mx-auto">
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
        {axisList?.map((axis, index) => (
          <LessonPlanContent
            axisId={axis.id}
            tabValue={`tab-${index + 1}`}
            key={axis.id}
            lessonPlanData={axisForms[axis.id]}
          />
        ))}
      </Tabs>
    </>
  )
}
