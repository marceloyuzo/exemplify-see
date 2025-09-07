import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { UserRoundIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { useParams, useRouter } from 'next/navigation'

interface LessonPlanDetailedMetadataProps {
  user?: {
    id: string
    name: string
    photoURL: string
  }
  exampleType: string
  topic?: string
  complexity?: string
  subject?: string
  workload: string
  modality: string
  year: string
}

export default function LessonPlanDetailedMetadata({
  user,
  exampleType,
  topic,
  complexity,
  subject,
  modality,
  workload,
  year,
}: LessonPlanDetailedMetadataProps) {
  const params = useParams()
  const lessonId = params.planoId
  const router = useRouter()

  return (
    <Card className="w-full col-span-1 flex flex-col">
      <CardHeader>
        <Button
          className="w-full text-card-foreground mb-4"
          variant={'outline'}
          onClick={() =>
            router.push(` /plano-de-aula?lessonPlanId=${lessonId}`)
          }
        >
          Usar Modelo
        </Button>
        <CardTitle
          className="scroll-m-20 text-2xl font-semibold tracking-tight bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
        bg-clip-text text-transparent"
        >
          Identificação
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 mt-4">
            <Avatar>
              <AvatarImage src={user?.photoURL} alt="Profile image" />
              <AvatarFallback>
                <UserRoundIcon
                  size={16}
                  className="opacity-60"
                  aria-hidden="true"
                />
              </AvatarFallback>
            </Avatar>
            <Label>{user?.name}</Label>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          Tipo do Plano de Aula:{' '}
          <span className="font-bold text-primary">
            {(() => {
              switch (exampleType) {
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
          Disciplina: <span className="font-bold text-primary">{subject}</span>
        </div>
        <div>
          Tema: <span className="font-bold text-primary">{topic}</span>
        </div>
        <div>
          Nível do aluno:{' '}
          <span className="font-bold text-primary">{complexity}</span>
        </div>
        <div>
          Ano/Semestre: <span className="font-bold text-primary">{year}</span>
        </div>
        <div>
          Carga Horária:{' '}
          <span className="font-bold text-primary">{workload}</span>
        </div>
        <div>
          Modalidade: <span className="font-bold text-primary">{modality}</span>
        </div>
      </CardContent>
    </Card>
  )
}
