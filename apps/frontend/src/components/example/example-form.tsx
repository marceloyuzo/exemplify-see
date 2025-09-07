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
  CardFooter,
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { HomeIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'
import { updateExample } from '@/api/example/update-example'
import { useUser } from '@/hooks/use-user'

const addExampleSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório.'),
  description: z.string().min(1, 'Descrição é obrigatório.'),
  topicId: z.string().min(1, 'O tema é obrigatório.'),
  modelsId: z.array(z.string().min(1)),
  exampleType: z.string().min(1, 'O tipo do exemplo é obrigatório.'),
  references: z.array(
    z.object({
      value: z.string().min(1, 'O valor da referência é obrigatório.'),
    }),
  ),
  files: z.array(z.any()).optional(),
})

type AddExampleSchemaType = z.infer<typeof addExampleSchema>

interface ExampleData {
  id: string
  title: string
  description: string
  author: {
    id: string
    name: string
  }
  references: string[]
  exampleModel: Array<{
    model: {
      id: string
      title: string
    }
  }>
  type: string
  topic: {
    id: string
    title: string
  }
  attachment?: Array<{
    id: string
    title: string
    url: string
    type: string
  }>
}

interface FormExemploProps {
  initialData?: ExampleData | null
  isEditing?: boolean
}

export default function FormExemplo({
  initialData = null,
  isEditing = false,
}: FormExemploProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [filesToRemove, setFilesToRemove] = useState<string[]>([])
  const { user } = useUser()
  const isOwner = initialData?.author.id === user?.id

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<AddExampleSchemaType>({
    resolver: zodResolver(addExampleSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      topicId: initialData?.topic.id || '',
      modelsId: initialData?.exampleModel.map((em) => em.model.id) || [],
      exampleType: initialData?.type || '',
      references: initialData?.references.map((ref) => ({ value: ref })) || [],
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

  const handleRemoveFile = (fileId: string) => {
    setFilesToRemove((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId],
    )
  }

  const isFileMarkedForRemoval = (fileId: string) => {
    return filesToRemove.includes(fileId)
  }

  const { mutateAsync: createExampleAsync } = useMutation({
    mutationFn: createExample,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples-admin'] })
    },
  })

  const { mutateAsync: updateExampleAsync } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateExample({
        id,
        formData: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['examples-admin'] })
      queryClient.invalidateQueries({ queryKey: ['example', initialData?.id] })
    },
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

      if (isEditing && filesToRemove.length > 0) {
        filesToRemove.forEach((fileId) => {
          formData.append('removeAttachmentIds[]', fileId)
        })
      }

      if (isEditing && initialData?.id) {
        await updateExampleAsync({ id: initialData.id, data: formData })
        toast.success('Exemplo atualizado com sucesso.', {
          position: 'top-center',
          duration: 3000,
        })
      } else {
        await createExampleAsync(formData)
        toast.success('Exemplo criado com sucesso.', {
          position: 'top-center',
          duration: 3000,
        })
      }

      router.push('/repositorio/exemplos')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message: string }>
        const message =
          axiosErr.response?.data.message ||
          axiosErr.message ||
          'Erro desconhecido'

        const action = isEditing ? 'atualizar' : 'criar'
        toast.error(`Aconteceu um erro ao ${action} o exemplo. ${message}`, {
          position: 'top-center',
          duration: 3000,
        })
      } else {
        const action = isEditing ? 'atualizar' : 'criar'
        toast.error(
          `Erro inesperado ao ${action} exemplo: ${(err as Error).message}`,
          {
            position: 'top-center',
            duration: 3000,
          },
        )
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
      label: isEditing ? 'Editar Exemplo' : 'Adicionar Exemplo',
      isCurrent: true,
    },
  ]

  if (!isOwner && isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Sem autorização
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-xl">
            Você está tentando acessar áreas onde você não tem permissão para
            isso.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant={'outline'} onClick={() => router.push('/')}>
            Voltar para o início
          </Button>
        </CardFooter>
      </Card>
    )
  }

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
            {isEditing ? 'Editar Exemplo' : 'Adicionar Exemplo'}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? 'Atualize as informações do exemplo. Todas as alterações são analisadas pelo administrador.'
              : 'Todos os exemplos enviados são analisados pelo administrador antes de publicar no repositório.'}
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
                    { label: 'Ambos', value: 'both' },
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

            {/* Seção de arquivos existentes (apenas no modo edição) */}
            {isEditing &&
              initialData?.attachment &&
              initialData.attachment.length > 0 && (
                <div className="col-span-3">
                  <Label className="scroll-m-20 text-xl font-semibold tracking-tight">
                    Arquivos Atuais
                  </Label>
                  <div className="mt-4 space-y-2">
                    {initialData.attachment
                      .filter((file) => !isFileMarkedForRemoval(file.id))
                      .map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              {file.title}
                            </span>
                            <span className="text-xs text-gray-500">
                              {file.type}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                            >
                              Visualizar
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                            >
                              Remover
                            </Button>
                          </div>
                        </div>
                      ))}

                    {/* Arquivos marcados para remoção */}
                    {initialData.attachment
                      .filter((file) => isFileMarkedForRemoval(file.id))
                      .map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-red-50 border-red-200"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-red-600 line-through">
                              {file.title}
                            </span>
                            <span className="text-xs text-red-500">
                              Será removido
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFile(file.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Restaurar
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

            <div className="col-span-3">
              <Label className="scroll-m-20 text-xl font-semibold tracking-tight">
                {isEditing
                  ? 'Novos Arquivos (Opcional)'
                  : 'Arquivos do Exemplo'}
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

              <Button type="submit">
                {isEditing ? 'Atualizar Exemplo' : 'Enviar Exemplo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
