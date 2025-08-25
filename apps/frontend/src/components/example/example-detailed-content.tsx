import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ExampleDetailedContentProps {
  description: string
}

export default function ExampleDetailedContent({
  description,
}: ExampleDetailedContentProps) {
  return (
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
          <p className="leading-7 [&:not(:first-child)]:mt-4">{description}</p>
        </div>
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Referências
          </h4>
          <span></span>
        </div>
        <div>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Avaliações
          </h4>
          <span></span>
        </div>
      </CardContent>
    </Card>
  )
}
