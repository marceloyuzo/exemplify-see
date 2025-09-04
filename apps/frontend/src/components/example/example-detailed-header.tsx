import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface ExampleDetailedHeaderProps {
  title: string
  rating: number | null
  createdAt: string
  updatedAt: string
}

export default function ExampleDetailedHeader({
  title,
  rating,
  createdAt,
  updatedAt,
}: ExampleDetailedHeaderProps) {
  return (
    <Card className="w-full flex flex-col">
      <CardHeader className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex justify-between">
          <div className="flex gap-8 text-secondary-foreground font-semibold leading-7 [&:not(:first-child)]:mt-2">
            <span>Criado em: {createdAt}</span>
            <span>Atualizado em: {updatedAt}</span>
          </div>
          <div className="text-lg font-semibold">
            <span>
              Nota: <span className="text-primary">{rating || 'N/A'}</span>
            </span>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  )
}
