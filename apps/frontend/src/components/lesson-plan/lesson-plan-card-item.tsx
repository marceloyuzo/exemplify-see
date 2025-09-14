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
  complexity: string
  example: string
  modality: string
  subject: string
  topic: string
  workload: string
  year: string
}

export default function LessonPlanCardItem({
  id,
  title,
  description,
  createdAt,
  user,
  averageRating,
  complexity,
  example,
  modality,
  subject,
  topic,
  workload,
  year,
}: LessonPlanCardItemProps) {
  const router = useRouter()
  const dateFormatted = format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <div
      className="w-full max-w-xs min-h-[340px] [perspective:1000px]"
      onClick={() => router.push(`/repositorio/planos-de-aula/${id}`)}
    >
      <div className="relative w-full min-h-[340px] h-full transition-transform duration-1000 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col cursor-pointer overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="line-clamp-1">{title}</CardTitle>
            <CardDescription className="flex justify-between">
              {dateFormatted}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-1 text-sm overflow-hidden min-h-0">
            {example && (
              <div className="flex-shrink-0 line-clamp-1">
                Tipo de Exemplo:{' '}
                <span className="font-bold text-primary">{example}</span>
              </div>
            )}
            <div className="flex-shrink-0 line-clamp-1">
              Disciplina:{' '}
              <span className="font-bold text-primary">{subject}</span>
            </div>
            <div className="flex-shrink-0 line-clamp-1">
              Tema: <span className="font-bold text-primary">{topic}</span>
            </div>
            {complexity && (
              <div className="flex-shrink-0 line-clamp-1">
                Complexidade:{' '}
                <span className="font-bold text-primary">{complexity}</span>
              </div>
            )}
            {modality && (
              <div className="flex-shrink-0 line-clamp-1">
                Modalidade:{' '}
                <span className="font-bold text-primary">{modality}</span>
              </div>
            )}
            <div className="flex-shrink-0 line-clamp-1">
              Carga horária (h):{' '}
              <span className="font-bold text-primary">{workload}</span>
            </div>
            <div className="flex-shrink-0">
              Ano/Semestre:{' '}
              <span className="font-bold text-primary">{year}</span>
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-2 flex-shrink-0">
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

        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col cursor-pointer overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="line-clamp-2">{title}</CardTitle>
            <CardDescription className="flex justify-between">
              {dateFormatted}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden min-h-0">
            <p className="text-sm line-clamp-6 break-words">{description}</p>
          </CardContent>
          <CardFooter className="justify-between gap-2 flex-shrink-0">
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
      </div>
    </div>
  )
}
