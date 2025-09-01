'use client'

import { Button } from '@/components/ui/button'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import ExampleList from '@/components/example/example-list'
import { Suspense } from 'react'

export default function RepositorioExemplosPage() {
  const router = useRouter()

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Repositório', href: '#' },
    {
      label: 'Exemplos',
      isCurrent: true,
    },
  ]

  return (
    <>
      <div className="space-y-4">
        <div className="flex gap-4">
          <Button
            variant={'outline'}
            onClick={() => router.push('/')}
            className="cursor-pointer"
          >
            Voltar
          </Button>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Repositório de Exemplos
        </h2>

        <Suspense fallback={<div>Carregando planos de aula...</div>}>
          <ExampleList myLessons={false} />
        </Suspense>
      </div>
    </>
  )
}
