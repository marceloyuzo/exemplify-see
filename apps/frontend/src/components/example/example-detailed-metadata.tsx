import { ExampleModel } from '@/api/example/get-example-detailed'
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
import { Badge } from '../ui/badge'

interface ExampleDetailedMetadataProps {
  user: {
    id: string
    name: string
    photoURL: string
  }
  exampleType: string
  topic: string
  exampleModel: ExampleModel[]
}

export default function ExampleDetailedMetadata({
  user,
  exampleType,
  exampleModel,
  topic,
}: ExampleDetailedMetadataProps) {
  return (
    <Card className="w-full col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle
          className="scroll-m-20 text-2xl font-semibold tracking-tight bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
        bg-clip-text text-transparent"
        >
          Informações específicas
        </CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 mt-4">
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
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          Tipo de Exemplo:{' '}
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
          Tema: <span className="font-bold text-primary">{topic}</span>
        </div>
        {exampleModel.length > 0 && (
          <div>
            Modelos:{' '}
            <div className="flex flex-wrap gap-2 mt-1">
              {exampleModel.map((model) => (
                <div key={model.model.id} className="max-w-[260px] min-w-0">
                  <Badge
                    title={model.model.title}
                    className="block w-full truncate bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
     text-background text-left px-2 py-1 text-xs font-bold"
                  >
                    {model.model.title}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
