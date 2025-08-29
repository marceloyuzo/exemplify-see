import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExampleRatingList from './example-rating-list'
import RatingDialog from '../rating/rating-dialog'
import { useState } from 'react'
import { Button } from '../ui/button'

interface ExampleDetailedContentProps {
  description: string
  references: string[]
}

export default function ExampleDetailedContent({
  description,
  references,
}: ExampleDetailedContentProps) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Card className="w-full col-span-3 flex flex-col">
        <CardHeader>
          <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary">
            Informações gerais
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-8">
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Descrição
            </h4>
            <p className="leading-7 [&:not(:first-child)]:mt-4">
              {description}
            </p>
          </div>
          <div>
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
              Referências
            </h4>
            {references.map((reference, index) => (
              <span key={index}>{reference}</span>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
                Avaliações dos professores
              </h4>
              <Button variant="outline" onClick={() => setOpen(true)}>
                Realizar Avaliação
              </Button>

              <RatingDialog open={open} setOpen={setOpen} />
            </div>
            <ExampleRatingList />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
