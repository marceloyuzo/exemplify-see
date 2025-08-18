import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader } from '../ui/card'
import { GetQuestionRoot } from '@/api/questions/get-question-root'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

interface LessonPlanFormProps {
  axisId: string
}

export default function LessonPlanForm({ axisId }: LessonPlanFormProps) {
  // const { handleSubmit, control } = useForm<{ [key: string]: 'yes' | 'no' }>()
  const { data: dataQuestionRoot } = useQuery({
    queryKey: ['question-root', axisId],
    queryFn: () =>
      GetQuestionRoot({
        axisId,
      }),
  })

  // const onSubmit = (values: { [key: string]: 'yes' | 'no' }) => {
  //   console.log('Respostas:', values)
  // }

  return (
    <Card className="col-span-2">
      <CardHeader></CardHeader>
      <CardContent>
        <form>
          <Label>{dataQuestionRoot?.title}</Label>
          <RadioGroup className="flex gap-8 mt-2">
            {dataQuestionRoot?.transitionsFromHere.map((nextQuestion) => (
              <div
                className="flex items-center gap-2"
                key={nextQuestion.answerValue.id}
              >
                <RadioGroupItem
                  value={nextQuestion.answerValue.id}
                  id={`${nextQuestion.answerValue.id}`}
                />
                <Label htmlFor={`${nextQuestion.answerValue.id}`}>
                  {nextQuestion.answerValue.title}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </form>
      </CardContent>
    </Card>
  )
}
