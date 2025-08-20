import { useQuery } from '@tanstack/react-query'
import LessonPlanCardItem from './lesson-plan-card-item'
import { getHighlightsLessonPlans } from '@/api/lesson-plan/get-highlights-lesson-plans'

interface LessonPlanCardListProps {
  myRepository: boolean
}

export default function LessonPlanCardList({
  myRepository,
}: LessonPlanCardListProps) {
  const {
    data: LessonPlansData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['repository-lesson-plans', myRepository],
    queryFn: () =>
      getHighlightsLessonPlans({
        myRepository,
      }),
  })

  if (isLoading) {
    return (
      <div className="mt-4 grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-64 w-full max-w-xs animate-pulse rounded-xl border bg-muted"
          />
        ))}
      </div>
    )
  }

  if (!LessonPlansData || LessonPlansData.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center p-8 text-center text-muted-foreground border rounded-xl">
        <p className="text-sm">
          {myRepository
            ? 'Você ainda não criou nenhum plano de aula.'
            : 'Nenhum plano de aula disponível no momento.'}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-4 grid grid-cols-4 gap-4 relative">
      {isFetching && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-xl z-10">
          <span className="text-sm text-muted-foreground">Atualizando...</span>
        </div>
      )}

      {LessonPlansData.map((lessonPlan) => (
        <LessonPlanCardItem
          key={lessonPlan.id}
          id={lessonPlan.id}
          title={lessonPlan.title}
          description={lessonPlan.description}
          createdAt={lessonPlan.createdAt}
        />
      ))}
    </div>
  )
}
