'use client'

import dynamic from 'next/dynamic'

const LessonPlanClient = dynamic(
  () => import('@/client/lesson-plan-client'),
  { ssr: false }, // desativa server-side rendering
)

export default function LessonPlanPage() {
  return <LessonPlanClient />
}
