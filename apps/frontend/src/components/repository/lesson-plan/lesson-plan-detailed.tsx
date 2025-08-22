import { getLessonPlanDetailed } from '@/api/lesson-plan/get-lesson-plan-detailed'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { UserRoundIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'

interface LessonPlanDetailedProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  lessonId: string
}

export default function LessonPlanDetailed({
  open,
  setOpen,
  lessonId,
}: LessonPlanDetailedProps) {
  const router = useRouter()

  const { data: lessonPlanData } = useQuery({
    queryKey: ['lesson-plan', lessonId],
    queryFn: () =>
      getLessonPlanDetailed({
        lessonPlanId: lessonId,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    enabled: !!open,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{lessonPlanData?.title}</DialogTitle>
          <DialogDescription className="text-secondary-foreground">
            {lessonPlanData?.createdAt
              ? format(
                  new Date(lessonPlanData.createdAt),
                  "d 'de' MMMM 'de' yyyy",
                  { locale: ptBR },
                )
              : '-'}
          </DialogDescription>
        </DialogHeader>

        <div>
          <span className="font-light">Descrição:</span>
          <p className="leading-7">{lessonPlanData?.description}</p>
        </div>

        <Separator />

        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
          Informações do plano de aula
        </h4>
        {lessonPlanData?.subject && (
          <div>
            <span className="font-light">
              Disciplina:{' '}
              <span className="text-primary font-semibold">
                {lessonPlanData.subject.title}
              </span>
            </span>
          </div>
        )}

        {lessonPlanData?.topic && (
          <div>
            <span className="font-light">
              Tema:{' '}
              <span className="text-primary font-semibold">
                {lessonPlanData.topic.title}
              </span>
            </span>
          </div>
        )}

        {lessonPlanData?.example && (
          <div>
            <span className="font-light">
              Tipo de exemplo:{' '}
              <span className="text-primary font-semibold">
                {lessonPlanData.exampleLabel}
              </span>
            </span>
          </div>
        )}

        {lessonPlanData?.complexity && (
          <div>
            <span className="font-light">
              Complexidade:{' '}
              <span className="text-primary font-semibold">
                {lessonPlanData.complexityLabel}
              </span>
            </span>
          </div>
        )}

        <DialogFooter className="mt-4">
          <div className="w-full flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={lessonPlanData?.user.photoURL}
                  alt="Profile image"
                />
                <AvatarFallback>
                  <UserRoundIcon
                    size={16}
                    className="opacity-60"
                    aria-hidden="true"
                  />
                </AvatarFallback>
              </Avatar>
              <Label>{lessonPlanData?.user.name}</Label>
            </div>
            <div className="flex gap-2">
              <DialogClose asChild>
                <Button variant="outline">Voltar</Button>
              </DialogClose>
              <Button
                type="button"
                onClick={() =>
                  router.push(` /plano-de-aula?lessonPlanId=${lessonId}`)
                }
              >
                Utilizar Modelo
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
