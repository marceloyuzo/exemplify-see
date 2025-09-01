'use client'

import dynamic from 'next/dynamic'

const PainelAbordagensClient = dynamic(
  () => import('@/client/painel-abordagens-client'),
  { ssr: false },
)

export default function PainelAbordagensPage() {
  return <PainelAbordagensClient />
}
