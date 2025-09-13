import { format } from 'date-fns'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { ptBR } from 'date-fns/locale'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Trash2Icon, UserRoundIcon } from 'lucide-react'
import { Label } from '../ui/label'
import { useUser } from '@/hooks/use-user'
import { useState } from 'react'
import LessonPlanRatingDeleteDialog from './lesson-plan-rating-delete-dialog'

interface LessonPlanRatingItemProps {
  user: {
    id: string
    name: string
    photoURL: string
  }
  ratingId: string
  rate: number
  comment?: string
  createdAt: string
}

export default function LessonPlanRatingItem({
  rate,
  user: author,
  ratingId,
  comment,
  createdAt,
}: LessonPlanRatingItemProps) {
  const { user } = useUser()
  const [open, setOpen] = useState<boolean>(false)

  const dateFormatted = format(new Date(createdAt), "d 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  })

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <CardTitle>
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={author.photoURL} alt="Profile image" />
                    <AvatarFallback>
                      <UserRoundIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <Label>{author.name}</Label>
                </div>
              </CardTitle>
              <CardDescription>{dateFormatted}</CardDescription>
            </div>
            <div className="text-lg font-bold flex flex-col items-end gap-2">
              {(user?.id === author.id || user?.role === 'admin') && (
                <div
                  className="cursor-pointer hover:text-red-500 transition-all duration-200"
                  onClick={() => setOpen(true)}
                >
                  <Trash2Icon size={14} />
                </div>
              )}
              <div className="flex items-center gap-2 text-lg">
                <span className="text-secondary-foreground">Nota:</span>
                <span className="text-primary">{rate}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p>{comment}</p>
        </CardContent>
      </Card>

      <LessonPlanRatingDeleteDialog
        open={open}
        setOpen={setOpen}
        ratingId={ratingId}
      />
    </>
  )
}
