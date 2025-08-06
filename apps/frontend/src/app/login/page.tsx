import GoogleIconColorful from '@/components/icon/google-icon-colorful'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function Login() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="mx-auto text-primary text-xl">
          Acesse sua conta
        </CardTitle>
        <CardDescription className="mx-auto">
          Entre de forma segura com sua conta Google
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full cursor-pointer">
          <GoogleIconColorful />
          Entra com Google
        </Button>
      </CardContent>
      <CardFooter className="flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div>
            <h4 className="text-primary text-sm">Colaboração Facilitada</h4>
            <p className="text-xs">
              Compartilhe planos de aula diretamente com colegas da mesma
              instituição.
            </p>
          </div>
          <div>
            <h4 className="text-primary text-sm">Acesso Instantâneo</h4>
            <p className="text-xs">
              Sem necessidade de criar nova senha ou lembrar credenciais extras.
            </p>
          </div>
        </div>

        <span className="text-center text-xs text-secondary-foreground">
          Ao continuar, você concorda com nossos Termos de Uso e spanolítica de
          Privacidade
        </span>
      </CardFooter>
    </Card>
  )
}
