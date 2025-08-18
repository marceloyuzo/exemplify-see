'use client'

import { useParams, notFound, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'

import {
  getApproachDetails,
  GetApproachDetailsResponse,
} from '@/api/approaches/get-approach-details'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { InputAnimated } from '@/components/ui/input-animated'
import { HomeIcon } from 'lucide-react'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import AxisList from '@/components/axis/axis-list'
import { editApproach, EditApproachProps } from '@/api/approaches/edit-approach'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { useSingleParam } from '@/utils/single-param'

const approachPageSchema = z.object({
  title: z.string().min(1, 'Titulo é obrigatório'),
})

type ApproachPageSchema = z.infer<typeof approachPageSchema>

export default function ApproachPage() {
  const router = useRouter()
  const params = useParams()
  const approachId = useSingleParam(params.abordagemId)
  const queryClient = useQueryClient()

  const { register, handleSubmit, watch } = useForm<ApproachPageSchema>({
    resolver: zodResolver(approachPageSchema),
  })

  const { data, isLoading, error } = useQuery<GetApproachDetailsResponse>({
    queryKey: ['approach', approachId],
    queryFn: () => getApproachDetails({ approachId }),
    enabled: !!approachId,
  })

  const { mutateAsync: edit } = useMutation({
    mutationFn: ({ id, title }: EditApproachProps) =>
      editApproach({
        id,
        title,
      }),
  })

  async function handleEditApproach({ title }: ApproachPageSchema) {
    try {
      await edit({
        id: approachId,
        title,
      })

      toast.success('Abordagem editada com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      queryClient.invalidateQueries({
        queryKey: ['approach', approachId],
      })
    } catch (err) {
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

  // Watch do campo title
  const watchedTitle = watch('title')

  // Verifica se o título mudou comparando com o original
  const isChanged = watchedTitle !== data?.title

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Painel Administrador', href: '/painel-administrador' },
    { label: 'Abordagens', href: '/painel-administrador/abordagens' },
    { label: data?.title || 'Carregando...', isCurrent: true },
  ]

  if (!approachId) return notFound()

  if (isLoading) {
    return <p>Carregando dados da abordagem...</p>
  }

  if (error) {
    return (
      <p className="text-red-600">
        Ocorreu um erro ao carregar a abordagem. Tente recarregar a página.
      </p>
    )
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button
          variant={'outline'}
          onClick={() => router.push('/painel-administrador/abordagens')}
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Abordagem - {data?.title}</CardTitle>
          <CardDescription>
            Edite o nome da abordagem atual. Altere o título e clique em Salvar
            título para atualizar as informações da abordagem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(handleEditApproach)}
            className="grid grid-cols-6 gap-2"
          >
            <div className="col-span-5 gap-2">
              <InputAnimated
                label="Nome da abordagem"
                required
                {...register('title')}
                defaultValue={data?.title}
              />
            </div>
            <Button
              type="submit"
              className="col-span-1"
              variant={'default'}
              disabled={!isChanged}
            >
              Salvar título
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2" />
      </Card>
      <AxisList axis={data?.axis} />
    </section>
  )
}
