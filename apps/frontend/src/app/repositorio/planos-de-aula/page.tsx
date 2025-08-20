'use client'

import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import LessonPlanCardList from '@/components/repository/lesson-plan/lesson-plan-card-list'
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
    { label: 'Repositório de Planos de Aula', isCurrent: true },
  ]
  return (
    <>
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.push(`/`)}
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
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Meus Planos de Aulas
        </h3>
        <LessonPlanCardList myRepository={true} />
      </section>

      <section className="mt-8">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Planos de Aulas da Comunidade
        </h3>
        <LessonPlanCardList myRepository={false} />
      </section>
    </>
  )
}
