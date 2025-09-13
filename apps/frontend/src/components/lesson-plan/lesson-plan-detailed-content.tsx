import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import LessonPlanRatingList from './lesson-plan-rating-list'
import LessonPlanRatingDialog from './lesson-plan-rating-dialog'
import { useUser } from '@/hooks/use-user'

interface LessonPlanDetailedContentProps {
  description: string | null
  contents: string[]
  materials: string[]
  priorKnowledge?: string
  authorId: string
}

export default function LessonPlanDetailedContent({
  description,
  contents,
  materials,
  priorKnowledge,
  authorId,
}: LessonPlanDetailedContentProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { user } = useUser()
  const isOwner = authorId === user?.id

  return (
    <>
      <Card className="w-full col-span-3 flex flex-col">
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-balance bg-[linear-gradient(to_right,var(--primary),var(--secondary))] bg-clip-text text-transparent">
            Informações gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Descrição
            </h4>
            <p className="leading-7 whitespace-pre-line [&:not(:first-child)]:mt-4">
              {description}
            </p>
          </div>

          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Lista de Materiais
            </h4>
            <div className="flex flex-col">
              <ul className="ml-6 list-disc [&>li]:mt-2">
                {materials.map((material, index) => (
                  <li key={index}>{material}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Conhecimentos Prévios
            </h4>
            <div className="w-full flex gap-4">{priorKnowledge}</div>
          </div>
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Conteúdos
            </h4>
            <div className="flex gap-2 mt-2">
              {contents.map((content, index) => (
                <Badge
                  key={index}
                  className="bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
             text-background font-semibold px-4 py-2 text-xs mb-1"
                >
                  {content}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Avaliações dos professores
              </h4>
              {!isOwner && (
                <Button variant="outline" onClick={() => setOpen(true)}>
                  Realizar Avaliação
                </Button>
              )}

              <LessonPlanRatingDialog open={open} setOpen={setOpen} />
            </div>
            <LessonPlanRatingList />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
