import { TabsContent } from '@/components/ui/tabs'
import LessonPlanForm from './lesson-plan-form'
import LessonPlanSteps from './lesson-plan-steps'

interface LessonPlanContentProps {
  axisId: string
  tabValue: string
}

export default function LessonPlanContent({
  axisId,
  tabValue,
}: LessonPlanContentProps) {
  return (
    <TabsContent value={tabValue} className="grid grid-cols-3 gap-2">
      <LessonPlanForm axisId={axisId} />
      <LessonPlanSteps axisId={axisId} />
    </TabsContent>
  )
}
