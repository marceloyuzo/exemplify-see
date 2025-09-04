import z from 'zod'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { InputAnimated } from '../ui/input-animated'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { createQuestion } from '@/api/questions/create-question'
import StepsList from '../step/steps-list'
import StepDialog from '../step/step-dialog'
import { useParams } from 'next/navigation'
import { useSingleParam } from '@/utils/single-param'
import { getQuestion } from '@/api/questions/get-question'
import { patchQuestion } from '@/api/questions/patch-question'
import { Checkbox } from '../ui/checkbox'

interface CreateQuestionDialogProps {
  parentTransitionId?: string
  questionId?: string
}

export interface Step {
  id: string
  title: string
  description?: string
  order: number
}

const createNewQuestionSchema = z
  .object({
    title: z.string().min(1, 'Enunciado é obrigatório'),
    optionA: z.string().min(1, 'Resposta é obrigatório'),
    optionB: z.string().min(1, 'Resposta é obrigatório'),
    optionC: z.string().optional(),
    enableThirdOption: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.enableThirdOption && !data.optionC?.trim()) {
        return false
      }
      return true
    },
    {
      message: 'Opção C é obrigatória quando habilitada',
      path: ['optionC'],
    },
  )

type CreateNewQuestionSchema = z.infer<typeof createNewQuestionSchema>

export default function QuestionDialog({
  parentTransitionId,
  questionId,
}: CreateQuestionDialogProps) {
  const params = useParams()
  const axisId = useSingleParam(params.eixoId)
  const queryClient = useQueryClient()
  const [openStepA, setOpenStepA] = useState(false)
  const [openStepB, setOpenStepB] = useState(false)
  const [openStepC, setOpenStepC] = useState(false)
  const [open, setOpen] = useState(false)
  const [enableThirdOption, setEnableThirdOption] = useState(false)

  const { data } = useQuery({
    queryKey: ['question', questionId],
    queryFn: () =>
      getQuestion({
        questionId: questionId || '',
      }),
    enabled: !!questionId,
  })

  const [stepsA, setStepsA] = useState<Step[]>([])
  const [stepsB, setStepsB] = useState<Step[]>([])
  const [stepsC, setStepsC] = useState<Step[]>([])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateNewQuestionSchema>({
    resolver: zodResolver(createNewQuestionSchema),
    defaultValues: {
      title: '',
      optionA: '',
      optionB: '',
      optionC: '',
      enableThirdOption: false,
    },
  })

  const { mutateAsync: createQuestionMutation, isPending: isPendingCreation } =
    useMutation({
      mutationFn: createQuestion,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['questions', axisId] })
        reset()
      },
    })

  const { mutateAsync: editQuestionMutation, isPending: isPendingEditing } =
    useMutation({
      mutationFn: patchQuestion,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['questions', axisId] })
        queryClient.invalidateQueries({ queryKey: ['question', questionId] })
        reset()
      },
    })

  const isPending = isPendingCreation || isPendingEditing

  useEffect(() => {
    if (data) {
      const hasThirdOption = data.transitionsFromHere?.length > 2

      const formData = {
        title: data.title || '',
        optionA: data.transitionsFromHere?.[0]?.answerValue?.title || '',
        optionB: data.transitionsFromHere?.[1]?.answerValue?.title || '',
        optionC: data.transitionsFromHere?.[2]?.answerValue?.title || '',
        enableThirdOption: hasThirdOption,
      }

      reset(formData)
      setEnableThirdOption(hasThirdOption)
      setStepsA(data.transitionsFromHere?.[0]?.answerValue?.steps || [])
      setStepsB(data.transitionsFromHere?.[1]?.answerValue?.steps || [])
      setStepsC(data.transitionsFromHere?.[2]?.answerValue?.steps || [])
    } else {
      setStepsA([])
      setStepsB([])
      setStepsC([])
      setEnableThirdOption(false)
    }
  }, [data, reset])

  async function handleAddQuestion(formData: CreateNewQuestionSchema) {
    const { optionA, optionB, optionC, title } = formData

    try {
      if (questionId) {
        await editQuestionMutation({
          questionId,
          title,
          optionValueA: optionA,
          optionIdA: data?.transitionsFromHere?.[0]?.answerId || '',
          optionValueB: optionB,
          optionIdB: data?.transitionsFromHere?.[1]?.answerId || '',
          ...(enableThirdOption &&
            optionC && {
              optionValueC: optionC,
              optionIdC: data?.transitionsFromHere?.[2]?.answerId || '',
            }),
          stepsA,
          stepsB,
          ...(enableThirdOption && { stepsC }),
        })

        toast.success('Questão editada com sucesso.', {
          position: 'top-center',
          duration: 3000,
        })

        setOpen(false)
        return
      }

      const questionData = {
        title,
        optionA,
        optionB,
        axisId,
        stepsA,
        stepsB,
        ...(enableThirdOption &&
          optionC && {
            optionC,
            stepsC,
          }),
        ...(parentTransitionId !== 'initial-question' && {
          parentTransitionId,
        }),
      }

      await createQuestionMutation(questionData)

      toast.success('Questão criada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao realizar a operação. ${message}`, {
          position: 'top-center',
          duration: 3000,
        })
      } else {
        toast.error(`Erro inesperado: ${(err as Error).message}`, {
          position: 'top-center',
          duration: 3000,
        })
      }
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="lg" className="shadow-lg">
            {questionId ? 'Editar pergunta' : 'Adicionar pergunta'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(handleAddQuestion)}
            id="question-form"
          >
            <DialogHeader>
              <DialogTitle>
                {questionId ? 'Editar pergunta' : 'Adicionar nova pergunta'}
              </DialogTitle>
              <DialogDescription>
                {questionId
                  ? 'Preencha as informações que deseja alterar.'
                  : 'Preencha as informações necessárias para adicioná-la à árvore de perguntas.'}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <InputAnimated
                  label={
                    questionId
                      ? 'Enunciado da pergunta'
                      : 'Enunciado da nova pergunta'
                  }
                  {...register('title')}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enable-third-option"
                  checked={enableThirdOption}
                  onCheckedChange={(checked) => {
                    setEnableThirdOption(checked as boolean)
                    if (!checked) {
                      reset({
                        ...watch(),
                        optionC: '',
                        enableThirdOption: false,
                      })
                      setStepsC([])
                    }
                  }}
                />
                <Label htmlFor="enable-third-option">
                  Adicionar terceira opção de resposta
                </Label>
              </div>

              <Label>Opções de resposta</Label>

              <div
                className={`grid gap-4 ${enableThirdOption ? 'grid-cols-3' : 'grid-cols-2'}`}
              >
                <div className="grid gap-3">
                  <InputAnimated label="Opção A" {...register('optionA')} />
                  {errors.optionA && (
                    <span className="text-sm text-red-500">
                      {errors.optionA.message}
                    </span>
                  )}
                </div>

                <div className="grid gap-3">
                  <InputAnimated label="Opção B" {...register('optionB')} />
                  {errors.optionB && (
                    <span className="text-sm text-red-500">
                      {errors.optionB.message}
                    </span>
                  )}
                </div>

                {enableThirdOption && (
                  <div className="grid gap-3">
                    <InputAnimated label="Opção C" {...register('optionC')} />
                    {errors.optionC && (
                      <span className="text-sm text-red-500">
                        {errors.optionC.message}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div
                className={`grid gap-4 ${enableThirdOption ? 'grid-cols-3' : 'grid-cols-2'}`}
              >
                <div className="flex flex-col gap-2">
                  <Label>Passos da Opção A</Label>
                  <StepsList setSteps={setStepsA} steps={stepsA} />
                  <Button
                    variant={'outline'}
                    type="button"
                    className="w-full"
                    onClick={() => setOpenStepA(true)}
                  >
                    Adicionar mais passos
                  </Button>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Passos da Opção B</Label>
                  <StepsList setSteps={setStepsB} steps={stepsB} />
                  <Button
                    variant={'outline'}
                    type="button"
                    className="w-full"
                    onClick={() => setOpenStepB(true)}
                  >
                    Adicionar mais passos
                  </Button>
                </div>

                {enableThirdOption && (
                  <div className="flex flex-col gap-2">
                    <Label>Passos da Opção C</Label>
                    <StepsList setSteps={setStepsC} steps={stepsC} />
                    <Button
                      variant={'outline'}
                      type="button"
                      className="w-full"
                      onClick={() => setOpenStepC(true)}
                    >
                      Adicionar mais passos
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    reset()
                    setEnableThirdOption(false)
                  }}
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending} form="question-form">
                {questionId
                  ? isPending
                    ? 'Editando...'
                    : 'Editar'
                  : isPending
                    ? 'Adicionando...'
                    : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <StepDialog
        step={null}
        open={openStepA}
        setOpen={setOpenStepA}
        steps={stepsA}
        setSteps={setStepsA}
      />
      <StepDialog
        step={null}
        open={openStepB}
        setOpen={setOpenStepB}
        steps={stepsB}
        setSteps={setStepsB}
      />
      {enableThirdOption && (
        <StepDialog
          step={null}
          open={openStepC}
          setOpen={setOpenStepC}
          steps={stepsC}
          setSteps={setStepsC}
        />
      )}
    </>
  )
}
