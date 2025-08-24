import { Card, CardContent, CardHeader } from '../ui/card'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { useLessonPlanContext, AxisData } from '@/contexts/lesson-plan-context'

interface LessonPlanFormProps {
  axisId: string
  lessonPlanData: AxisData
}

export default function LessonPlanForm({
  lessonPlanData,
}: LessonPlanFormProps) {
  const { questionsForm } = useLessonPlanContext()
  const { setValue } = questionsForm

  const {
    currentQuestions,
    isLoadingRoot,
    isLoadingNext,
    currentAnswers,
    totalQuestions,
    isCompleted,
  } = lessonPlanData

  if (isLoadingRoot) {
    return (
      <Card className="col-span-3">
        <CardContent>
          <div className="flex items-center justify-center p-6">
            Carregando pergunta...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (currentQuestions.length === 0) {
    return (
      <Card className="col-span-3">
        <CardContent>
          <div className="flex items-center justify-center p-6">
            Não há perguntas cadastradas nesse eixo.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex justify-between items-center">
          <span className="text-sm text-secondary-foreground">
            {totalQuestions} pergunta{totalQuestions !== 1 ? 's' : ''}
          </span>
          {isCompleted && (
            <span className="text-sm text-primary font-semibold">
              ✓ Completo
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {currentQuestions.map((question, index) => (
            <div key={question.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <Label className="text-base font-semibold">
                  {index + 1}. {question.title}
                </Label>
                {isLoadingNext && index === currentQuestions.length - 1 && (
                  <div className="text-xs text-gray-500">
                    Carregando próxima pergunta...
                  </div>
                )}
              </div>

              <RadioGroup
                className="flex gap-8 mt-2"
                value={currentAnswers[question.id] || ''}
                onValueChange={(value) => setValue(question.id, value)}
              >
                {question.transitionsFromHere.map((transition) => (
                  <div
                    className="flex items-center gap-2"
                    key={transition.answerValue.id}
                  >
                    <RadioGroupItem
                      value={transition.answerValue.id}
                      id={`${question.id}-${transition.answerValue.id}`}
                      className="cursor-pointer"
                    />
                    <Label
                      htmlFor={`${question.id}-${transition.answerValue.id}`}
                      className="cursor-pointer"
                    >
                      {transition.answerValue.title}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </form>
      </CardContent>
    </Card>
  )
}
