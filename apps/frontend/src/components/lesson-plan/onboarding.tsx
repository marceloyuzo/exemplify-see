'use client'

import { useState } from 'react'
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUser } from '@/hooks/use-user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { disableFirstTime } from '@/api/users/disable-first-time'

const stepContent = [
  {
    step: 1,
    imageSrc: '/etapa-1.svg',
    title: 'Bem-vindo ao Portal Exemplify-SEE!',
    description:
      'Vamos fazer um tour rápido pelas ferramentas que vão transformar seus planos de aula.',
  },
  {
    step: 2,
    imageSrc: '/etapa-2.svg',
    title: 'Selecione o eixo de aula que melhor se encaixa.',
    description:
      'Comece escolhendo a etapa da sua aula que se encontra atualmente. A partir da sua escolha, o formulário se adaptará com perguntas focadas para o seu objetivo pedagógico.',
  },
  {
    step: 3,
    imageSrc: '/etapa-3.svg',
    title: 'Responda às perguntas guiadas.',
    description:
      'Siga o nosso guia passo a passo. Cada pergunta foi pensada para ajudar você a estruturar os pontos-chave da aula.',
  },
  {
    step: 4,
    imageSrc: '/etapa-4.svg',
    title: 'Visualize seu plano de aula dinamicamente.',
    description:
      'À medida que você responde, o plano de aula é montado ao lado, em tempo real. Suas respostas se transformam automaticamente em um roteiro prático para seguir em sala.',
  },
  {
    step: 5,
    imageSrc: '/etapa-5.svg',
    title: 'Compartilhe e Colabore com a Comunidade',
    description:
      'Com seu plano finalizado, você pode exportar em pdf para usar em sala, salvar no seu repositório particular ou publicá-lo na comunidade. Inspire outros professores e descubra novos planos!',
  },
]

export default function OnBoarding() {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [step, setStep] = useState(1)
  const { user } = useUser()
  const queryClient = useQueryClient()

  const totalSteps = stepContent.length

  const { mutateAsync: disableFirstTimeAsync } = useMutation({
    mutationFn: disableFirstTime,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })

  const handleContinue = () => {
    if (step < totalSteps) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  async function handleClose() {
    if (user?.firstTime) {
      await disableFirstTimeAsync()
    }

    setIsOpen(false)
  }

  return (
    <Dialog
      defaultOpen={!!user?.firstTime}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Onboarding</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 p-0 [&>button:last-child]:text-white">
        <div key={step} className="fade-in">
          <div className="p-4">
            <img
              className="w-full rounded-md aspect-video object-cover"
              src={stepContent[step - 1].imageSrc}
              alt={stepContent[step - 1].title}
            />
          </div>
          <div className="space-y-6 px-6 pt-3 pb-6">
            <DialogHeader>
              <DialogTitle>{stepContent[step - 1].title}</DialogTitle>
              <DialogDescription>
                {stepContent[step - 1].description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex justify-center space-x-1.5 max-sm:order-1">
                {[...Array(totalSteps)].map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      'bg-primary size-1.5 rounded-full',
                      index + 1 === step ? 'bg-primary' : 'opacity-20',
                    )}
                  />
                ))}
              </div>
              <DialogFooter>
                {step > 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="group"
                  >
                    <ArrowLeftIcon
                      className="-ms-1 me-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
                      size={16}
                    />
                    Voltar
                  </Button>
                ) : (
                  // Botão para pular apenas no primeiro passo
                  <Button variant="ghost" onClick={handleClose}>
                    Pular
                  </Button>
                )}
                {step < totalSteps ? (
                  <Button
                    className="group"
                    type="button"
                    onClick={handleContinue}
                  >
                    Avançar
                    <ArrowRightIcon
                      className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
                      size={16}
                      aria-hidden="true"
                    />
                  </Button>
                ) : (
                  <DialogClose asChild>
                    <Button type="button" onClick={() => handleClose()}>
                      Concluir
                    </Button>
                  </DialogClose>
                )}
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
