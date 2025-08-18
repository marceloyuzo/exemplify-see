import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { InputAnimated } from '../ui/input-animated'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { editAxis, EditAxisProps } from '@/api/axis/edit-axis'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'

interface AxisEditCardProps {
  axisId: string
  isLoading: boolean
  isFetching: boolean
  error: Error | null
  title?: string
}

const axisEditSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
})

type AxisEditSchema = z.infer<typeof axisEditSchema>

export default function AxisEditCard({
  axisId,
  error,
  isFetching,
  isLoading,
  title,
}: AxisEditCardProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<AxisEditSchema>({
    resolver: zodResolver(axisEditSchema),
    defaultValues: {
      title,
    },
  })
  const queryClient = useQueryClient()

  const { mutateAsync: edit } = useMutation({
    mutationFn: ({ id, title }: EditAxisProps) =>
      editAxis({
        id,
        title,
      }),
  })

  async function handleEditAxis({ title }: AxisEditSchema) {
    try {
      await edit({
        id: axisId,
        title,
      })

      toast.success('Eixo editado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      queryClient.invalidateQueries({
        queryKey: ['axis', axisId],
      })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao editar o eixo. ${message}`, {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Eixo - {title}</CardTitle>
        <CardDescription>
          Edite o nome do eixo atual. Altere o título e clique em Salvar título
          para atualizar as informações do eixo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="text-muted-foreground text-sm">
            Carregando dados...
          </div>
        )}

        {error && (
          <div className="text-destructive text-sm">
            Ocorreu um erro ao carregar o eixo.
          </div>
        )}

        {!isLoading && !error && (
          <form
            className="grid grid-cols-6 gap-2"
            onSubmit={handleSubmit(handleEditAxis)}
          >
            <div className="col-span-5">
              <InputAnimated
                label="Nome do eixo"
                error={errors.title}
                {...register('title')}
              />
            </div>
            <Button type="submit" className="col-span-1" variant="default">
              {isFetching ? 'Atualizando...' : 'Salvar título'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2" />
    </Card>
  )
}
