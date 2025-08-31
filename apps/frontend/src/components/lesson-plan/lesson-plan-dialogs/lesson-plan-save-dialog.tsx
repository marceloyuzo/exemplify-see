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
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSubjectOptions } from '@/api/subject/get-subject.options'
import { useLessonPlanContext } from '@/contexts/lesson-plan-context'
import { TextareaAnimated } from '@/components/ui/text-area-animated'
import { SelectOverlapping } from '@/components/ui/select-overlapping'
import { Controller } from 'react-hook-form'
import { getTopicOptions } from '@/api/topic/get-topic-options'
import { CheckboxWithLabel } from '@/components/ui/checkbox-with-label'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const queryClient = useQueryClient()
  const { metadataForm, saveLessonPlan, isSaving, isOwner, isEditing } =
    useLessonPlanContext()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = metadataForm

  const handleSave = async () => {
    try {
      await saveLessonPlan()

      queryClient.invalidateQueries({
        queryKey: ['repository-lesson-plans'],
      })

      setIsOpen(false)

      router.push('/repositorio/planos-de-aula')
    } catch (error) {
      // O erro já é tratado no hook
    }
  }

  const { data: subjectsData, isLoading: subjectIsLoading } = useQuery({
    queryKey: ['subject-options'],
    queryFn: getSubjectOptions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  })

  const { data: topicsData, isLoading: topicIsLoading } = useQuery({
    queryKey: ['topic-options'],
    queryFn: getTopicOptions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={!isAnyFormCompleted}>
          {isOwner && isEditing ? 'Editar Plano' : 'Salvar Plano'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[1000px]">
        <form onSubmit={handleSubmit(handleSave)}>
          <DialogHeader>
            <DialogTitle>Salvar Plano de Aula</DialogTitle>
            <DialogDescription>
              Preencha as informações que deseja colocar no seu plano de aula.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="grid gap-6">
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
                <InputAnimated
                  label="Ano/Semestre *"
                  {...register('year')}
                  disabled={isSaving}
                  error={errors.year}
                />
              </div>
              <div className="grid gap-3">
                <InputAnimated
                  label="Carga horária (horas) *"
                  {...register('workload')}
                  disabled={isSaving}
                  error={errors.workload}
                  type="number"
                />
              </div>
              <div className="grid gap-3">
                <Controller
                  control={control}
                  name="subjectId"
                  render={({ field }) => (
                    <SelectOverlapping
                      label="Selecione uma disciplina *"
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
                      label="Selecione um tema *"
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
                  name="modality"
                  render={({ field }) => (
                    <SelectOverlapping
                      label="Selecione uma modalidade (Opcional)"
                      options={[
                        { label: 'Presencial', value: 'inPerson' },
                        { label: 'Híbrido', value: 'hybrid' },
                        { label: 'Remoto', value: 'remote' },
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
                        { label: 'Ambos', value: 'both' },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                      error={errors.example}
                    />
                  )}
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <TextareaAnimated
                  className="min-h-30"
                  label="Conhecimento Prévio (Opcional)"
                  {...register('priorKnowledge')}
                  disabled={isSaving}
                  error={errors.priorKnowledge}
                />
              </div>

              <div className="grid gap-3">
                <Label>Conteúdos</Label>
                <div className="col-span-3 grid gap-2">
                  {metadataForm.watch('contents').map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <InputAnimated
                        className="col-span-2"
                        label="Conteúdo"
                        {...metadataForm.register(`contents.${index}`)}
                        error={errors.contents?.[index]}
                      />
                      <Button
                        type="button"
                        variant={'destructive'}
                        onClick={() => {
                          const newContents = [
                            ...metadataForm.getValues('contents'),
                          ]
                          newContents.splice(index, 1)
                          metadataForm.setValue('contents', newContents)
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  className="col-span-3"
                  variant={'outline'}
                  type="button"
                  onClick={() =>
                    metadataForm.setValue('contents', [
                      ...metadataForm.getValues('contents'),
                      '',
                    ])
                  }
                >
                  Adicionar
                </Button>
              </div>

              <div className="grid gap-3">
                <Label>Referência de Material</Label>
                <div className="col-span-3 grid gap-2">
                  {metadataForm.watch('materials').map((_, index) => (
                    <div key={index} className="grid grid-cols-2 gap-2">
                      <InputAnimated
                        className="col-span-2"
                        label="Referência de Material"
                        {...metadataForm.register(`materials.${index}`)}
                        error={errors.materials?.[index]}
                      />
                      <Button
                        type="button"
                        variant={'destructive'}
                        onClick={() => {
                          const newMaterial = [
                            ...metadataForm.getValues('materials'),
                          ]
                          newMaterial.splice(index, 1)
                          metadataForm.setValue('materials', newMaterial)
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  className="col-span-3"
                  variant={'outline'}
                  type="button"
                  onClick={() =>
                    metadataForm.setValue('materials', [
                      ...metadataForm.getValues('materials'),
                      '',
                    ])
                  }
                >
                  Adicionar
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <div className="grid gap-3 mb-4">
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
