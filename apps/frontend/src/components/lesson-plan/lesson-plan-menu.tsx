import { Button } from '../ui/button'
import LessonPlanSaveDialog from './lesson-plan-dialogs/lesson-plan-save-dialog'

interface LessonPlanMenuProps {
  title: string
  description: string
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  onSave: () => Promise<void>
  onReset: () => void
  isSaving: boolean
  isAnyFormCompleted: boolean
  totalCompletedForms: number
  totalForms: number
}

export default function LessonPlanMenu({
  title,
  description,
  setTitle,
  setDescription,
  onSave,
  onReset,
  isSaving,
  isAnyFormCompleted,
  totalCompletedForms,
  totalForms,
}: LessonPlanMenuProps) {
  return (
    <div className="my-4 flex gap-4">
      <LessonPlanSaveDialog
        title={title}
        description={description}
        setTitle={setTitle}
        setDescription={setDescription}
        onSave={onSave}
        isSaving={isSaving}
        isAnyFormCompleted={isAnyFormCompleted}
        totalCompletedForms={totalCompletedForms}
        totalForms={totalForms}
      />

      <Button 
        variant={'outline'} 
        onClick={onReset}
        disabled={isSaving}
      >
        Limpar Plano
      </Button>

      <Button variant={'outline'} disabled>
        Carregar Plano
      </Button>

      <Button variant={'outline'} disabled>
        Exportar Plano PDF
      </Button>
    </div>
  )
}
