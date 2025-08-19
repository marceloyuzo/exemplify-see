import { TabsContent } from '@/components/ui/tabs'
import LessonPlanForm from './lesson-plan-form'
import LessonPlanSteps from './lesson-plan-steps'
import { useLessonPlanQuestions } from '@/hooks/use-lesson-plan-questions'

interface LessonPlanContentProps {
  axisId: string
  tabValue: string
}

export default function LessonPlanContent({
  axisId,
  tabValue,
}: LessonPlanContentProps) {
  const lessonPlanData = useLessonPlanQuestions(axisId)

  return (
    <TabsContent value={tabValue} className=" grid grid-cols-5 gap-2">
      <LessonPlanForm axisId={axisId} lessonPlanData={lessonPlanData} />
      <LessonPlanSteps axisId={axisId} lessonPlanData={lessonPlanData} />
    </TabsContent>
  )
}
