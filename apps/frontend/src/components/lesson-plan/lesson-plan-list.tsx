'use client'

import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { ArrowUpDownIcon } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { DataTablePagination } from '@/components/table/pagination'
import { findLessonPlans } from '@/api/lesson-plan/find-lesson-plans'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SelectOverlapping } from '@/components/ui/select-overlapping'
import { getSubjectOptions } from '@/api/subject/get-subject.options'
import { getTopicOptions } from '@/api/topic/get-topic-options'
import { InputAnimated } from '@/components/ui/input-animated'
import { useDebounce } from 'use-debounce'
import LessonPlanCardItem from './lesson-plan-card-item'

const handleFilterLessonPlanSchema = z.object({
  title: z.string().optional(),
  subjectId: z.string().optional(),
  topicId: z.string().optional(),
  complexity: z.string().optional(),
  example: z.string().optional(),
})

interface LessonPlanListProps {
  myLessons: boolean
}

export default function LessonPlanList({ myLessons }: LessonPlanListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const perPage = Number(searchParams.get('perPage')) || 25
  const orderBy = searchParams.get('orderBy') || 'asc'
  const lessonPlanNameParam = searchParams.get('lessonPlanName') || ''
  const subjectIdParam = searchParams.get('subjectId') || ''
  const topicIdParam = searchParams.get('topicId') || ''
  const complexityParam = searchParams.get('complexity') || ''
  const exampleParam = searchParams.get('example') || ''

  const {
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(handleFilterLessonPlanSchema),
    defaultValues: {
      title: lessonPlanNameParam,
      subjectId: subjectIdParam,
      topicId: topicIdParam,
      complexity: complexityParam,
      example: exampleParam,
    },
  })

  const isUpdatingFromURL = useRef(false)

  const lessonPlanName = watch('title')
  const subjectId = watch('subjectId')
  const topicId = watch('topicId')
  const complexity = watch('complexity')
  const example = watch('example')

  const [debouncedLessonPlanName] = useDebounce(lessonPlanName, 500)

  const updateURL = useCallback(
    (params: Record<string, string | number>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()))

      Object.entries(params).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) {
          current.delete(key)
        } else {
          current.set(key, String(value))
        }
      })

      router.push(`?${current.toString()}`, { scroll: false })
    },
    [searchParams, router],
  )

  useEffect(() => {
    const urlValues = {
      title: lessonPlanNameParam,
      subjectId: subjectIdParam,
      topicId: topicIdParam,
      complexity: complexityParam,
      example: exampleParam,
    }

    const currentFormValues = {
      title: lessonPlanName || '',
      subjectId: subjectId || '',
      topicId: topicId || '',
      complexity: complexity || '',
      example: example || '',
    }

    type FilterKey = keyof typeof urlValues

    const needsSync = (Object.keys(urlValues) as FilterKey[]).some(
      (key) => currentFormValues[key] !== urlValues[key],
    )

    if (needsSync) {
      isUpdatingFromURL.current = true
      setValue('title', urlValues.title)
      setValue('subjectId', urlValues.subjectId)
      setValue('topicId', urlValues.topicId)
      setValue('complexity', urlValues.complexity)
      setValue('example', urlValues.example)
      setTimeout(() => {
        isUpdatingFromURL.current = false
      }, 100)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    lessonPlanNameParam,
    subjectIdParam,
    topicIdParam,
    complexityParam,
    exampleParam,
    setValue,
  ])

  const previousFilters = useRef({
    lessonPlanName: lessonPlanNameParam,
    subjectId: subjectIdParam,
    topicId: topicIdParam,
    example: exampleParam,
    complexity: complexityParam,
  })

  useEffect(() => {
    if (isUpdatingFromURL.current) return

    const currentFilters = {
      lessonPlanName: debouncedLessonPlanName || '',
      subjectId: subjectId || '',
      topicId: topicId || '',
      complexity: complexity || '',
      example: example || '',
    }

    const filtersChanged = Object.keys(currentFilters).some(
      (key) =>
        currentFilters[key as keyof typeof currentFilters] !==
        previousFilters.current[key as keyof typeof previousFilters.current],
    )

    if (filtersChanged) {
      updateURL({ ...currentFilters, page: 1 })
      previousFilters.current = currentFilters
    } else {
      updateURL(currentFilters)
    }
  }, [
    debouncedLessonPlanName,
    subjectId,
    topicId,
    complexity,
    example,
    updateURL,
  ])

  function handleSortToggle() {
    const neworderBy = orderBy === 'asc' ? 'desc' : 'asc'
    updateURL({ orderBy: neworderBy })
  }

  const {
    data: lessonPlansData,
    isLoading: lessonPlansIsLoading,
    error,
    isFetching: lessonPlansIsFetching,
  } = useQuery({
    queryKey: [
      'lesson-plans-list',
      page,
      perPage,
      debouncedLessonPlanName,
      orderBy,
      subjectId,
      topicId,
      complexity,
      example,
      myLessons,
    ],
    queryFn: () =>
      findLessonPlans({
        page,
        perPage,
        lessonPlanName: debouncedLessonPlanName,
        orderBy,
        subjectId,
        topicId,
        complexity,
        example,
        myLessons,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    retry: 3,
  })

  const { data: subjectsData, isLoading: subjectIsLoading } = useQuery({
    queryKey: ['subject-options'],
    queryFn: getSubjectOptions,
  })

  const { data: topicsData, isLoading: topicIsLoading } = useQuery({
    queryKey: ['topic-options'],
    queryFn: getTopicOptions,
  })

  if (lessonPlansIsLoading || lessonPlansIsFetching) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Carregando Planos de Aula...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="rounded-full bg-destructive/10 p-3">
            <svg
              className="h-6 w-6 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-destructive mb-1">
              Erro ao carregar planos de aula
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {error.message || 'Ocorreu um erro inesperado'}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!lessonPlansData?.data) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="rounded-full bg-muted p-3">
            <svg
              className="h-6 w-6 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Nenhum dado disponível
            </p>
            <p className="text-xs text-muted-foreground">
              Não foi possível carregar os planos de aula
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="">
        <div className="flex items-center justify-between gap-2">
          <div className="relative">
            <InputAnimated
              label="Título do Plano de Aula"
              value={lessonPlanName}
              onChange={(e) => setValue('title', e.target.value)}
              className="w-64"
            />
          </div>

          <div className="w-full flex gap-2">
            <Controller
              control={control}
              name="subjectId"
              render={({ field }) => (
                <SelectOverlapping
                  className="w-full max-w-[220px]"
                  label="Disciplina"
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
                  clearable={true}
                  onClear={() => setValue('subjectId', '')}
                />
              )}
            />

            <Controller
              control={control}
              name="topicId"
              render={({ field }) => (
                <SelectOverlapping
                  className="w-full max-w-[220px]"
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
              name="complexity"
              render={({ field }) => (
                <SelectOverlapping
                  className="w-full max-w-[200px]"
                  label="Nível de Complexidade"
                  options={[
                    { label: 'Iniciante', value: 'beginner' },
                    { label: 'Intermediário', value: 'intermediate' },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.complexity}
                  clearable={true}
                  onClear={() => setValue('complexity', '')}
                />
              )}
            />

            <Controller
              control={control}
              name="example"
              render={({ field }) => (
                <SelectOverlapping
                  className="w-full max-w-[160px]"
                  label="Tipo de Exemplo"
                  options={[
                    { label: 'Correto', value: 'correct' },
                    { label: 'Errôneo', value: 'erroneous' },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                  error={errors.example}
                  clearable={true}
                  onClear={() => setValue('example', '')}
                />
              )}
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              size="default"
              onClick={handleSortToggle}
              className="flex items-center gap-2"
            >
              <ArrowUpDownIcon className="h-4 w-4" />
              Data de Criação
              {orderBy === 'desc' ? ' ↓' : ' ↑'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {lessonPlansData.meta.total === 0 && (
            <p className="col-span-4 text-center text-lg my-20">
              Não encontramos nenhum resultado.
            </p>
          )}

          {lessonPlansData.data.map((lessonPlan) => (
            <LessonPlanCardItem
              key={lessonPlan.id}
              id={lessonPlan.id}
              complexity={lessonPlan.complexity}
              example={lessonPlan.example}
              modality={lessonPlan.modality}
              subject={lessonPlan.subject.title}
              topic={lessonPlan.topic.title}
              workload={lessonPlan.workload}
              year={lessonPlan.year}
              title={lessonPlan.title}
              description={lessonPlan.description}
              createdAt={lessonPlan.createdAt}
              user={lessonPlan.user}
              averageRating={lessonPlan.averageRating}
            />
          ))}
        </div>

        <DataTablePagination
          currentPage={lessonPlansData.meta.page}
          totalPages={lessonPlansData.meta.totalPages}
          perPage={perPage}
        />
      </div>
    </>
  )
}
