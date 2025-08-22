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
import { useState } from 'react'
import { InputAnimated } from '@/components/ui/input-animated'
import { useQuery } from '@tanstack/react-query'
import { getSubjectOptions } from '@/api/subject/get-subject.options'
import { useLessonPlanContext } from '@/contexts/lesson-plan-context'
import { TextareaAnimated } from '@/components/ui/text-area-animated'
import { SelectOverlapping } from '@/components/ui/select-overlapping'
import { Controller } from 'react-hook-form'
import { getTopicOptions } from '@/api/topic/get-topic-options'
import { CheckboxWithLabel } from '@/components/ui/checkbox-with-label'
import { Separator } from '@/components/ui/separator'

interface LessonPlanSaveDialogProps {
  isAnyFormCompleted: boolean
  totalCompletedForms: number
  totalForms: number
}

export default function LessonPlanSaveDialog({
  isAnyFormCompleted,
  totalCompletedForms,
  totalForms,
}: LessonPlanSaveDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { metadataForm, saveLessonPlan, isSaving } = useLessonPlanContext()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = metadataForm

  const handleSave = async () => {
    try {
      await saveLessonPlan()
      setIsOpen(false)
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  const { data: subjectsData, isLoading: subjectIsLoading } = useQuery({
    queryKey: ['subject-options'],
    queryFn: getSubjectOptions,
  })

  const { data: topicsData, isLoading: topicIsLoading } = useQuery({
    queryKey: ['topic-options'],
    queryFn: getTopicOptions,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!isAnyFormCompleted}>
          Salvar Plano ({totalCompletedForms}/{totalForms})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogHeader>
            <DialogTitle>Salvar Plano de Aula</DialogTitle>
            <DialogDescription>
              Preencha as informações que deseja colocar no seu plano de aula.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 mt-6">
            <div className="grid gap-3">
              <InputAnimated
                label="Título *"
                {...register('title')}
                disabled={isSaving}
                error={errors.title}
              />
            </div>
            <div className="grid gap-3">
              <TextareaAnimated
                label="Descrição (Opcional)"
                {...register('description')}
                disabled={isSaving}
                error={errors.description}
              />
            </div>
            <div className="grid gap-3">
              <Separator />
              <h4 className="scroll-m-20 text-sm font-semibold tracking-tight">
                Informações do plano de aula
              </h4>
            </div>
            <div className="grid gap-3">
              <Controller
                control={control}
                name="subjectId"
                render={({ field }) => (
                  <SelectOverlapping
                    label="Selecione uma disciplina (Opcional)"
                    options={
                      subjectIsLoading
                        ? []
                        : (subjectsData?.map((subject) => ({
                            label: subject.title,
                            value: subject.id,
                          })) ?? [])
                    }
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.subjectId}
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                control={control}
                name="topicId"
                render={({ field }) => (
                  <SelectOverlapping
                    label="Selecione um tema (Opcional)"
                    options={
                      topicIsLoading
                        ? []
                        : (topicsData?.map((topic) => ({
                            label: topic.title,
                            value: topic.id,
                          })) ?? [])
                    }
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.topicId}
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                control={control}
                name="complexity"
                render={({ field }) => (
                  <SelectOverlapping
                    label="Selecione uma complexidade (Opcional)"
                    options={[
                      { label: 'Iniciante', value: 'beginner' },
                      { label: 'Intermediário', value: 'intermediate' },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.complexity}
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                control={control}
                name="example"
                render={({ field }) => (
                  <SelectOverlapping
                    label="Selecione o tipo de exemplo (Opcional)"
                    options={[
                      { label: 'Correto', value: 'correct' },
                      { label: 'Errôneo', value: 'erroneous' },
                    ]}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={errors.example}
                  />
                )}
              />
            </div>
            <div className="grid gap-3">
              <Controller
                control={control}
                name="isPublic"
                render={({ field }) => (
                  <CheckboxWithLabel
                    label="Plano público"
                    sublabel="visível para outros usuários"
                    description="Se marcado, este plano poderá ser utilizado por outros usuários."
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    error={errors.isPublic}
                  />
                )}
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
            <Button disabled={isSaving}>
              {isSaving ? 'Salvando...' : 'Salvar Plano'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
