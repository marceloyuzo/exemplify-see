import { Card, CardContent, CardHeader } from '../ui/card'
import VerticalTimeline from '../ui/timeline-vertical'
import { AxisData } from '@/contexts/lesson-plan-context'

interface LessonPlanStepsProps {
  axisId: string
  lessonPlanData: AxisData
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
