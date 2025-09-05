import LessonPlanHTML from '@/components/pdf/lesson-plan-pdf'
import { pdf } from '@react-pdf/renderer'
import { toast } from 'sonner'

export interface LessonPlanPdfStep {
  id: string
  lessonPlanAnswerId: string
  title: string
  description: string
  order: number
  createdAt: string
  updatedAt: string
}

export interface LessonPlanPdfAxis {
  axisTitle: string
  steps: LessonPlanPdfStep[]
}

export interface LessonPlanPdf {
  title: string
  approach: {
    title: string
  }
  description: string
  year: string
  workload: string
  subject: {
    title: string
  }
  topic: {
    title: string
  }
  complexity: string
  modality: string
  example: string
  priorKnowledge: string
  contents: string[]
  materials: string[]
  axes: LessonPlanPdfAxis[]
  complexityLabel: string | null
  exampleLabel: string | null
  modalityLabel: string | null
}

interface GeneratePdfProps {
  payload: LessonPlanPdf
}

export default async function generatePdf({ payload }: GeneratePdfProps) {
  try {
    // Gerar PDF no browser
    const blob = await pdf(<LessonPlanHTML payload={payload} />).toBlob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${payload.title}.pdf`
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    toast.error('Erro ao gerar PDF no navegador')
  }
}
