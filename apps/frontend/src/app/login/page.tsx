'use client'

import { signIn } from '@/api/auth/sign-in'
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
import { useUser } from '@/hooks/use-user'
import { auth, googleProvider } from '@/lib/firebase'
import { useMutation } from '@tanstack/react-query'
import { signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false)
  const { refetch } = useUser()

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignInWithGoogle() {
    if (loading) return
    setLoading(true)

    try {
      const userCredential = await signInWithPopup(auth, googleProvider)

      const token = await userCredential.user.getIdToken()

      const response = await authenticate({ token })

      toast.success(`Bem-vindo, ${response.data.user.name}!`, {
        description: response.data.message,
        position: 'top-center',
        duration: 5000,
      })
      refetch()
      window.location.href = '/'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        toast.warning('Você fechou o popup de login.', {
          position: 'top-center',
          duration: 5000,
        })
        return
      }

      toast.error('Erro ao entrar com o Google', {
        position: 'top-center',
        duration: 5000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex w-full min-h-[calc(100vh-160px)] justify-center items-center">
      <Card className="w-full max-w-sm max-h-fit">
        <CardHeader>
          <CardTitle className="mx-auto text-primary text-xl">
            Acesse sua conta
          </CardTitle>
          <CardDescription className="mx-auto">
            Entre de forma segura com sua conta Google
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            type="button"
            onClick={() => handleSignInWithGoogle()}
            disabled={loading}
          >
            <GoogleIconColorful />
            {loading ? 'Entrando...' : 'Entrar com Google'}
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
                Sem necessidade de criar nova senha ou lembrar credenciais
                extras.
              </p>
            </div>
          </div>

          <span className="text-center text-xs text-secondary-foreground">
            Ao continuar, você concorda com nossos Termos de Uso e spanolítica
            de Privacidade
          </span>
        </CardFooter>
      </Card>
    </section>
  )
}
