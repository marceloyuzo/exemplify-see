import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { UserRoundIcon } from 'lucide-react'

interface ExampleDetailedMetadataProps {
  user: {
    id: string
    name: string
    photoURL: string
  }
  exampleType: string
  topic: string
}

export default function ExampleDetailedMetadata({
  user,
  exampleType,
  topic,
}: ExampleDetailedMetadataProps) {
  return (
    <Card className="w-full col-span-1 flex flex-col">
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-semibold tracking-tight text-primary">
          Informações específicas
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div>
          Tipo de Exemplo:{' '}
          <span>{exampleType === 'correct' ? 'Correto' : 'Errôneo'}</span>
        </div>
        <div>
          Tema: <span>{topic}</span>
        </div>
        <div>
          Modelo: <span></span>
        </div>
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
      </CardContent>
    </Card>
  )
}
