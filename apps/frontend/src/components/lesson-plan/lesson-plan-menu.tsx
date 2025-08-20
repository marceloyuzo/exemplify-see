'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import LessonPlanSaveDialog from './lesson-plan-dialogs/lesson-plan-save-dialog'
import { useLessonPlanContext } from '@/contexts/lesson-plan-context'

export default function LessonPlanMenu() {
  const router = useRouter()
  const {
    title,
    description,
    setTitle,
    setDescription,
    saveLessonPlan,
    resetAllForms,
    isSaving,
    isAnyFormCompleted,
    totalCompletedForms,
    totalForms,
  } = useLessonPlanContext()

  return (
    <div className="my-4 flex gap-4">
      <LessonPlanSaveDialog
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
        onSave={saveLessonPlan}
        isSaving={isSaving}
        isAnyFormCompleted={isAnyFormCompleted}
        totalCompletedForms={totalCompletedForms}
        totalForms={totalForms}
      />

      <Button variant={'outline'} onClick={resetAllForms} disabled={isSaving}>
        Limpar Plano
      </Button>

      <Button
        variant={'outline'}
        onClick={() => router.push('/repositorio/planos-de-aula')}
      >
        Repositório de Planos
      </Button>

      <Button variant={'outline'} disabled>
        Exportar Plano PDF
      </Button>
    </div>
  )
}
