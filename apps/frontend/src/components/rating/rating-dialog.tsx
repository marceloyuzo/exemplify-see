import { createRating } from '@/api/rating/create-rating'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useSingleParam } from '@/utils/single-param'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import { Dispatch, SetStateAction } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const addRatingSchema = z.object({
  rate: z.string().min(1, 'Selecione uma nota'),
  comment: z.string().optional(),
})

type AddRatingSchemaType = z.infer<typeof addRatingSchema>

interface RatingDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function RatingDialog({ open, setOpen }: RatingDialogProps) {
  const { register, handleSubmit, control, reset } =
    useForm<AddRatingSchemaType>({
      resolver: zodResolver(addRatingSchema),
    })
  const params = useParams()
  const exampleId = useSingleParam(params.exemploId)
  const queryClient = useQueryClient()

  const { mutateAsync: createRatinAsync } = useMutation({
    mutationFn: createRating,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ratings'],
      })
    },
  })

  async function handleAddRating(data: AddRatingSchemaType) {
    try {
      await createRatinAsync({
        exampleId,
        rate: Number(data.rate),
        comment: data.comment,
      })

      toast.success('Avaliação realizada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      setOpen(false)
      reset()
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao deletar a avaliação. ${message}`, {
          position: 'top-center',
          duration: 3000,
        })
      } else {
        toast.error(`Erro inesperado: ${(err as Error).message}`, {
          position: 'top-center',
          duration: 3000,
        })
      }

      setOpen(false)
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col gap-0 p-0 [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Avalie este exemplo
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4">
          <form className="space-y-5" onSubmit={handleSubmit(handleAddRating)}>
            <div className="space-y-4">
              <div>
                <fieldset className="space-y-4">
                  <legend className="text-foreground text-lg leading-none font-semibold">
                    Qual a sua avaliação para este exemplo?
                  </legend>
                  <Controller
                    name="rate"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                        className="flex gap-0 -space-x-px rounded-md shadow-xs"
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (number) => (
                            <label
                              key={number}
                              className="border-input has-data-[state=checked]:border-primary/50 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex size-9 flex-1 cursor-pointer flex-col items-center justify-center gap-3 border text-center text-sm transition-[color,box-shadow] outline-none first:rounded-s-md last:rounded-e-md has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50 has-data-[state=checked]:z-10"
                            >
                              <RadioGroupItem
                                id={`radio-${number}`}
                                value={number.toString()}
                                className="sr-only after:absolute after:inset-0"
                              />
                              {number}
                            </label>
                          ),
                        )}
                      </RadioGroup>
                    )}
                  />
                </fieldset>
                <div className="text-muted-foreground mt-2 flex justify-between text-xs">
                  <p>Péssimo</p>
                  <p>Excelente</p>
                </div>
              </div>

              <div className="*:not-first:mt-2">
                <Label htmlFor="feedback">
                  Gostaria de deixar um comentário?
                </Label>
                <Textarea
                  id="feedback"
                  placeholder="How can we improve Origin UI?"
                  aria-label="Send feedback"
                  {...register('comment')}
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Enviar avaliação
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
