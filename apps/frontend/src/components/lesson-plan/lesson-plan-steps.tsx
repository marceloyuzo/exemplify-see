import { useLessonPlanQuestions } from '@/hooks/use-lesson-plan-questions'
import { Card, CardContent, CardHeader } from '../ui/card'

interface LessonPlanStepsProps {
  axisId: string
}

export default function LessonPlanSteps({ axisId }: LessonPlanStepsProps) {
  const { stepsByQuestion } = useLessonPlanQuestions(axisId)

  console.log(stepsByQuestion)

  return (
    <Card>
      <CardHeader></CardHeader>
      <CardContent>STEPS</CardContent>
    </Card>
  )
}
