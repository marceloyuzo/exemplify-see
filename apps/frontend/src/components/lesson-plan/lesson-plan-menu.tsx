'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import LessonPlanSaveDialog from './lesson-plan-dialogs/lesson-plan-save-dialog'
import { useLessonPlanContext } from '@/contexts/lesson-plan-context'
import { Tooltip, TooltipTrigger } from '../ui/tooltip'
import { TooltipContent } from '@radix-ui/react-tooltip'
import { useMutation } from '@tanstack/react-query'
import { getInformationPdf } from '@/api/lesson-plan/get-information-pdf'
import generatePdf from '@/utils/generate-pdf'

export default function LessonPlanMenu() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const lessonPlanId = searchParams.get('lessonPlanId')
  const {
    resetAllForms,
    isSaving,
    isAnyFormCompleted,
    totalCompletedForms,
    totalForms,
  } = useLessonPlanContext()

  const { mutateAsync: getInformationPdfAsync } = useMutation({
    mutationFn: getInformationPdf,
  })

  const handleGeneratePdf = async () => {
    if (!lessonPlanId) {
      return
    }

    try {
      const data = await getInformationPdfAsync({
        lessonPlanId,
      })

      await generatePdf({
        payload: data,
      })
    } catch (error) {
      // Erro já tratado pela mutation no contexto
    }
  }

  async function handleClean() {
    resetAllForms()

    router.push('/plano-de-aula')
  }

  return (
    <div className="my-4 flex gap-4">
      <Button variant={'outline'} onClick={handleClean} disabled={isSaving}>
        Novo Plano
      </Button>

      <Button
        variant={'outline'}
        onClick={() => router.push('/repositorio/planos-de-aula')}
      >
        Repositório de Planos
      </Button>

      <LessonPlanSaveDialog
        isAnyFormCompleted={isAnyFormCompleted}
        totalCompletedForms={totalCompletedForms}
        totalForms={totalForms}
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            <Button
              variant="outline"
              onClick={handleGeneratePdf}
              disabled={!isAnyFormCompleted || !lessonPlanId}
            >
              {'Exportar Plano PDF'}
            </Button>
          </span>
        </TooltipTrigger>
        {!lessonPlanId && (
          <TooltipContent
            side="bottom"
            className="mt-2 bg-popover text-popover-foreground border border-border rounded-lg px-3 py-2 shadow-md text-sm"
          >
            É necessário salvar o plano de aula primeiro
          </TooltipContent>
        )}
      </Tooltip>
    </div>
  )
}
