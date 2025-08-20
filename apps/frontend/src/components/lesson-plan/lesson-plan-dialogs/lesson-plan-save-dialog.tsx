import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'

interface LessonPlanSaveDialogProps {
  title: string
  description: string
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  onSave: () => Promise<void>
  isSaving: boolean
  isAnyFormCompleted: boolean
  totalCompletedForms: number
  totalForms: number
}

export default function LessonPlanSaveDialog({
  title,
  description,
  setTitle,
  setDescription,
  onSave,
  isSaving,
  isAnyFormCompleted,
  totalCompletedForms,
  totalForms,
}: LessonPlanSaveDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSave = async () => {
    try {
      await onSave()
      setIsOpen(false)
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!isAnyFormCompleted}>
          Salvar Plano ({totalCompletedForms}/{totalForms})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Salvar Plano de Aula</DialogTitle>
          <DialogDescription>
            Dê um título e descrição para salvar seu plano de aula.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do plano de aula"
              disabled={isSaving}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para o plano de aula"
              rows={3}
              disabled={isSaving}
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Eixos completos: {totalCompletedForms}/{totalForms}
            </p>
            {totalCompletedForms > 0 && (
              <p className="text-green-600">
                ✓ Seu plano de aula será salvo com {totalCompletedForms} eixo
                {totalCompletedForms !== 1 ? 's' : ''} completo
                {totalCompletedForms !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSaving}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSaving || !title.trim()}>
            {isSaving ? 'Salvando...' : 'Salvar Plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
