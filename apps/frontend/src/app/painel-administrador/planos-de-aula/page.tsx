'use client'

import dynamic from 'next/dynamic'

const PainelPlanosDeAulaClient = dynamic(
  () => import('@/client/painel-planos-de-aula-client'),
  { ssr: false }, // desativa server-side rendering
)

export default function PainelPlanosDeAulaPage() {
  return <PainelPlanosDeAulaClient />
}
