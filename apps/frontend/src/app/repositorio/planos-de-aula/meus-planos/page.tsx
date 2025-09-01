'use client'

import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import LessonPlanList from '@/components/lesson-plan/lesson-plan-list'
import { Suspense } from 'react'

export default function MeusPlanosPage() {
  const router = useRouter()

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Repositório', href: '#' },
    {
      label: 'Planos de Aula',
      href: '/repositorio/planos-de-aula',
    },
    {
      label: 'Meus Planos',
      isCurrent: true,
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.push('/repositorio/planos-de-aula')}
            className="cursor-pointer"
          >
            Voltar
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <Suspense fallback={<div>Carregando planos de aula...</div>}>
          <LessonPlanList myLessons={true} />
        </Suspense>
      </div>
    </>
  )
}
