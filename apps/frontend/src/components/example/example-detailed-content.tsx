import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExampleRatingList from './example-rating-list'
import RatingDialog from '../rating/rating-dialog'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Attachment } from '@/api/example/get-example-detailed'
import ExampleAttachmentCard from './example-attachment-card'
import { useUser } from '@/hooks/use-user'

interface ExampleDetailedContentProps {
  description: string
  references: string[]
  attachments: Attachment[]
  authorId: string
}

export default function ExampleDetailedContent({
  description,
  references,
  attachments,
  authorId,
}: ExampleDetailedContentProps) {
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
          {references.length > 0 && (
            <div>
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Referências
              </h4>
              <div className="flex flex-col">
                <ul className="ml-6 list-disc [&>li]:mt-2">
                  {references.map((reference, index) => (
                    <li key={index}>{reference}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Arquivos relacionados ao exemplo
            </h4>
            <div className="w-full flex gap-4">
              {attachments.map((attachment) => (
                <ExampleAttachmentCard
                  key={attachment.id}
                  title={attachment.title}
                  type={attachment.type}
                  url={attachment.url}
                />
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

              <RatingDialog open={open} setOpen={setOpen} />
            </div>
            <ExampleRatingList />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
