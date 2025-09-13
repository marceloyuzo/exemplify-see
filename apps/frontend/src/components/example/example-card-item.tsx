import { ExampleModel } from '@/api/example/get-example-detailed'
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

interface ExampleCardItemProps {
  id: string
  title: string
  description: string
  createdAt: string
  topic: string
  type: string
  exampleModel: ExampleModel[]
  user: User
  averageRating: number | null
}

export default function ExampleCardItem({
  id,
  title,
  description,
  exampleModel,
  topic,
  type,
  createdAt,
  user,
  averageRating,
}: ExampleCardItemProps) {
  const router = useRouter()
  const dateFormatted = format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <div
      className="w-full max-w-xs min-h-72 [perspective:1000px]"
      onClick={() => router.push(`/repositorio/exemplos/${id}`)}
    >
      <div className="relative w-full h-full transition-transform duration-1000 [transform-style:preserve-3d] group hover:[transform:rotateY(180deg)]">
        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] flex flex-col cursor-pointer">
          <CardHeader>
            <CardTitle className="line-clamp-3">{title}</CardTitle>
            <CardDescription className="flex justify-between">
              {dateFormatted}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-1 text-sm">
            <div>
              Tipo de Exemplo:{' '}
              <span className="font-bold text-primary">
                {(() => {
                  switch (type) {
                    case 'correct':
                      return 'Correto'
                    case 'erroneous':
                      return 'Errôneo'
                    case 'both':
                      return 'Ambos'
                    default:
                      return '-'
                  }
                })()}
              </span>
            </div>
            <div>
              Tema: <span className="font-bold text-primary">{topic}</span>
            </div>
            <div>
              {exampleModel.length > 0 && (
                <div>
                  <span className="font-medium">Modelos: </span>
                  {exampleModel.map((model, idx) => (
                    <span
                      key={model.model.id}
                      className="font-bold text-primary"
                    >
                      {model.model.title}
                      {idx < exampleModel.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between gap-2 mt-auto">
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

        <Card className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col cursor-pointer">
          <CardHeader>
            <CardTitle className="line-clamp-2">{title}</CardTitle>
            <CardDescription className="flex justify-between">
              {dateFormatted}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <p className="text-sm line-clamp-6 break-words">{description}</p>
          </CardContent>
          <CardFooter className="justify-between gap-2 mt-auto">
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
