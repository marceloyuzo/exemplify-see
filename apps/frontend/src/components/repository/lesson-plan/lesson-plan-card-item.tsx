import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useRouter } from 'next/navigation'

interface LessonPlanCardItemProps {
  id: string
  title: string
  description: string
  createdAt: string
}

export default function LessonPlanCardItem({
  id,
  title,
  description,
  createdAt,
}: LessonPlanCardItemProps) {
  const router = useRouter()
  const dateFormatted = format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <Card
      className="w-full max-w-xs h-64 flex flex-col cursor-pointer transition-all duration-300 hover:scale-[1.01]"
      onClick={() => router.push(`/lesson-plan/${id}`)}
    >
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
        <CardDescription className="flex justify-between">
          {dateFormatted}
          <span className="font-bold text-primary">4.5</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm line-clamp-4 break-words">{description}</p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button
          size="sm"
          className="text-xs inset-4"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          Usar Modelo
        </Button>
      </CardFooter>
    </Card>
  )
}
