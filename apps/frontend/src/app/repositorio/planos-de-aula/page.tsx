'use client'

import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import LessonPlanCardList from '@/components/lesson-plan/lesson-plan-card-list'
import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LessonPlanRepositoryPage() {
  const router = useRouter()

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Repositório', href: '#' },
    { label: 'Planos de Aula', isCurrent: true },
  ]
  return (
    <>
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <h2 className="mt-8 scroll-m-20pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Repositório de Planos de Aula
      </h2>

      <section className="mt-8">
        <div className="flex items-end gap-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Meus Planos de Aulas
          </h3>
          <span
            className="underline text-sm text-secondary-foreground cursor-pointer"
            onClick={() =>
              router.push('/repositorio/planos-de-aula/meus-planos')
            }
          >
            Explorar mais
          </span>
        </div>

        <LessonPlanCardList myRepository={true} />
      </section>

      <section className="mt-8">
        <div className="flex items-end gap-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Planos de Aulas da Comunidade
          </h3>
          <span
            className="underline text-sm text-secondary-foreground cursor-pointer"
            onClick={() =>
              router.push('/repositorio/planos-de-aula/planos-da-comunidade')
            }
          >
            Explorar mais
          </span>
        </div>
        <LessonPlanCardList myRepository={false} />
      </section>
    </>
  )
}
