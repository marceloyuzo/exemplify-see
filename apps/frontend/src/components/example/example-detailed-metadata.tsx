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
            {exampleType === 'correct' ? 'Correto' : 'Errôneo'}
          </span>
        </div>
        <div>
          Tema: <span className="font-bold text-primary">{topic}</span>
        </div>
        <div>
          Modelos:{' '}
          {exampleModel.map((model) => (
            <div className="flex gap-1" key={model.model.id}>
              <Badge
                className="bg-[linear-gradient(to_right,var(--primary),var(--secondary))] 
             text-background font-bold px-1 py-1 text-xs mb-1"
              >
                {model.model.title}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
