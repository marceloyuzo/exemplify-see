'use client'

import { createExample } from '@/api/example/create-example'
import { getModelOptions } from '@/api/models/get-model-options'
import { getTopicOptions } from '@/api/topic/get-topic-options'
import { Breadcrumbs } from '@/components/interface/breadcrumbs'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FileUploaderController } from '@/components/ui/file-uploader-input'
import { InputAnimated } from '@/components/ui/input-animated'
import { Label } from '@/components/ui/label'
import { MultiSelectOverlapping } from '@/components/ui/mutiselect-custom'
import { SelectOverlapping } from '@/components/ui/select-overlapping'
import { TextareaAnimated } from '@/components/ui/text-area-animated'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

const addExampleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório.'),
  description: z.string().min(1, 'Descrição é obrigatório.'),
  topicId: z.string().min(1, 'O tema é obrigatório.'),
  modelsId: z
    .array(z.string().min(1))
    .min(1, 'Pelo menos um modelo é obrigatório.'),
  exampleType: z.string().min(1, 'O tipo do exemplo é obrigatório.'),
  references: z
    .array(
      z.object({
        value: z.string().min(1, 'O valor da referência é obrigatório.'),
      }),
    )
    .min(1, 'Pelo menos uma referência é obrigatória.'),
  files: z
    .array(z.any())
    .min(1, 'Pelo menos um arquivo é obrigatório.')
    .optional(),
})

type AddExampleSchemaType = z.infer<typeof addExampleSchema>

export default function FormCriacaoExemplo() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddExampleSchemaType>({
    resolver: zodResolver(addExampleSchema),
    defaultValues: {
      title: '',
      description: '',
      topicId: '',
      modelsId: [],
      exampleType: '',
      references: [],
      files: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'references',
  })

  const { data: topicsData, isLoading: topicIsLoading } = useQuery({
    queryKey: ['topic-options'],
    queryFn: getTopicOptions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })

  const { data: modelsData, isLoading: modelIsLoading } = useQuery({
    queryKey: ['model-options'],
    queryFn: getModelOptions,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  })

  const { mutateAsync: createExampleAsync } = useMutation({
    mutationFn: createExample,
  })

  async function handleSubmitExample(data: AddExampleSchemaType) {
    try {
      const formData = new FormData()

      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('exampleType', data.exampleType)
      formData.append('topicId', data.topicId)

      data.modelsId.forEach((modelId) => {
        formData.append('modelsId[]', modelId)
      })

      data.references.forEach((ref, index) => {
        formData.append(`references[${index}]`, ref.value)
      })

      data.files?.forEach((fileWithPreview) => {
        if (fileWithPreview.file instanceof File) {
          formData.append('files', fileWithPreview.file)
        }
      })

      await createExampleAsync(formData)

      toast.success('Exemplo criado com sucesso.', {
        position: 'top-center',
        duration: 3000,
      })

      router.push('/repositorio/exemplos')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        toast.error(`Aconteceu um erro ao criar o exemplo. ${message}`, {
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

  const breadcrumbItems = [
    {
      label: 'Ínicio',
      href: '/',
      icon: <HomeIcon size={16} aria-hidden="true" />,
    },
    { label: 'Repositório', href: '#' },
    {
      label: 'Exemplos',
      href: '/repositorio/exemplos',
    },
    {
      label: 'Adicionar Exemplo',
      isCurrent: true,
    },
  ]

  return (
    <>
      <div className="flex gap-4 mb-10">
        <Button
          variant={'outline'}
          onClick={() => router.push('/repositorio/exemplos')}
          className="cursor-pointer"
        >
          Voltar
        </Button>
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className='className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"'>
            Adicionar Exemplo
          </CardTitle>
          <CardDescription>
            Todos os exemplos enviados são analisados pelo administrador antes
            de publicar no repositório.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action=""
            className="grid grid-cols-3 gap-4"
            onSubmit={handleSubmit(handleSubmitExample)}
          >
            <div className="col-span-3">
              <InputAnimated
                label="Título do Exemplo*"
                {...register('title')}
                error={errors.title}
              />
            </div>
            <div className="col-span-3">
              <TextareaAnimated
                label="Descrição*"
                {...register('description')}
                error={errors.description}
              />
            </div>

            <Controller
              control={control}
              name="exampleType"
              render={({ field }) => (
                <SelectOverlapping
                  className="w-full col-span-1"
                  label="Tipo de Exemplo"
                  options={[
                    { label: 'Correto', value: 'correct' },
                    { label: 'Errôneo', value: 'erroneous' },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.exampleType}
                  clearable={true}
                  onClear={() => setValue('exampleType', '')}
                />
              )}
            />

            <Controller
              control={control}
              name="topicId"
              render={({ field }) => (
                <SelectOverlapping
                  className="w-full col-span-1"
                  label="Tema"
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
                  clearable={true}
                  onClear={() => setValue('topicId', '')}
                />
              )}
            />

            <Controller
              control={control}
              name="modelsId"
              render={({ field }) => (
                <MultiSelectOverlapping
                  key={modelIsLoading ? 'loading' : 'loaded'}
                  className="w-full col-span-1"
                  label="Modelos UML"
                  options={
                    modelIsLoading
                      ? []
                      : modelsData?.map((model) => ({
                          label: model.title,
                          value: model.id,
                        }))
                  }
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.modelsId?.message}
                  clearable
                  onClear={() => field.onChange([])}
                />
              )}
            />

            <div className="col-span-3 flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <Label
                  className="scroll-m-20 text-xl font-semibold tracking-tight"
                  htmlFor="referencia"
                >
                  Referências
                </Label>
                {errors.references && (
                  <span className="text-xs text-red-500">
                    {errors.references.message}
                  </span>
                )}
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-6 gap-4 items-center"
                >
                  <div className="col-span-5">
                    <Controller
                      control={control}
                      name={`references.${index}.value`}
                      render={({ field }) => (
                        <InputAnimated
                          label={`Referência ${index + 1}`}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="default"
                    onClick={() => remove(index)}
                  >
                    Remover
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ value: '' })}
              >
                Adicionar Mais Referência
              </Button>
            </div>
            <div className="col-span-3">
              <Label className="scroll-m-20 text-xl font-semibold tracking-tight">
                Arquivos do Exemplo
              </Label>
              <div className="mt-4">
                <FileUploaderController
                  name="files"
                  control={control}
                  maxSize={100 * 1024 * 1024} // 100MB
                  maxFiles={10}
                  multiple={true}
                  accept="*"
                />
              </div>
            </div>

            <div className="col-span-3 ml-auto flex gap-4">
              <Button
                variant={'outline'}
                type="button"
                onClick={() => router.push('/repositorio/exemplos')}
              >
                Cancelar
              </Button>

              <Button type="submit">Enviar Exemplo</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
