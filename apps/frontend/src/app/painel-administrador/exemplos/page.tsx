'use client'

import dynamic from 'next/dynamic'

const PainelExemplosClient = dynamic(
  () => import('@/client/painel-exemplos-client'),
  { ssr: false }, // desativa server-side rendering
)

export default function PainelExemplosPage() {
  return <PainelExemplosClient />
}
