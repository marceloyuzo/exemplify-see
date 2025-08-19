import { UseLessonPlanQuestionsReturn } from '@/hooks/use-lesson-plan-questions'
import { Card, CardContent, CardHeader } from '../ui/card'
import VerticalTimeline from '../ui/timeline-vertical'

interface LessonPlanStepsProps {
  axisId: string
  lessonPlanData: UseLessonPlanQuestionsReturn
}

export default function LessonPlanSteps({
  lessonPlanData,
}: LessonPlanStepsProps) {
  const { currentSteps } = lessonPlanData

  return (
    <Card className="col-span-2">
      <CardHeader>Passos Sugeridos</CardHeader>
      <CardContent>
        <VerticalTimeline steps={currentSteps} />
      </CardContent>
    </Card>
  )
}
