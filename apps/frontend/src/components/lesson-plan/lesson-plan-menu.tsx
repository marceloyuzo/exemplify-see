import { Button } from '../ui/button'
import LessonPlanSaveDialog from './lesson-plan-dialogs/lesson-plan-save-dialog'

export default function LessonPlanMenu() {
  return (
    <div className="my-4 flex gap-4">
      <Button variant={'outline'}>Limpar Plano</Button>

      <Button variant={'outline'}>Carregar Plano</Button>

      <LessonPlanSaveDialog />

      <Button variant={'outline'}>Exportar Plano PDF</Button>
    </div>
  )
}
