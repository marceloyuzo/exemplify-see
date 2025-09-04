import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UserRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  photoURL: string
}

interface LessonPlanCardItemProps {
  id: string
  title: string
  description: string
  createdAt: string
  user: User
  averageRating: number | null
}

export default function LessonPlanCardItem({
  id,
  title,
  description,
  createdAt,
  user,
  averageRating,
}: LessonPlanCardItemProps) {
  const router = useRouter()
  const dateFormatted = format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <>
      <Card
        className="w-full max-w-xs h-64 flex flex-col cursor-pointer transition-all duration-300 hover:scale-[1.01]"
        onClick={() => {
          router.push(`/repositorio/planos-de-aula/${id}`)
        }}
      >
        <CardHeader>
          <CardTitle className="line-clamp-1">{title}</CardTitle>
          <CardDescription className="flex justify-between">
            {dateFormatted}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm line-clamp-4 break-words">{description}</p>
        </CardContent>
        <CardFooter className="justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.photoURL} alt="Profile image" />
              <AvatarFallback>
                <UserRoundIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
              </AvatarFallback>
            </Avatar>
            <Label>{user.name}</Label>
          </div>
          <span className="font-bold text-primary">
            {averageRating || 'N/A'}
          </span>
        </CardFooter>
      </Card>
    </>
  )
}
