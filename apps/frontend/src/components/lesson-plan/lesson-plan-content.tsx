import { TabsContent } from '@/components/ui/tabs'
import LessonPlanForm from './lesson-plan-form'
import LessonPlanSteps from './lesson-plan-steps'
import { useLessonPlanContext } from '@/contexts/lesson-plan-context'
import { LessonPlanLoadingFallback } from './lesson-plan-loading-fallback'

interface LessonPlanContentProps {
  axisId: string
  tabValue: string
}

export default function LessonPlanContent({
  axisId,
  tabValue,
}: LessonPlanContentProps) {
  const { getAxisData, isReconstructing } = useLessonPlanContext()
  const lessonPlanData = getAxisData(axisId)

  return (
    <TabsContent value={tabValue} className="grid grid-cols-5 gap-2">
      {isReconstructing ? (
        <div className="col-span-4">
          <LessonPlanLoadingFallback />
        </div>
      ) : (
        <>
          <LessonPlanForm axisId={axisId} lessonPlanData={lessonPlanData} />
          <LessonPlanSteps axisId={axisId} lessonPlanData={lessonPlanData} />
        </>
      )}
    </TabsContent>
  )
}
