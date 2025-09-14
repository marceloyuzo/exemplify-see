'use client'

import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import dynamic from 'next/dynamic'

const LessonPlanList = dynamic(
  () => import('@/components/lesson-plan/lesson-plan-list'),
  { ssr: false },
)

export default function PlanosComunidadePage() {
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
      label: 'Planos da Comunidade',
      isCurrent: true,
    },
  ]

  return (
    <>
      <div className="space-y-4">
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

        <LessonPlanList myLessons={false} />
      </div>
    </>
  )
}
