import { Injectable } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import { ApproachService } from '../approach/approach.service'
import { TopicService } from '../topic/topic.service'
import { SubjectService } from '../subject/subject.service'
import { AxisService } from '../axis/axis.service'
import { Response } from 'express'

type Complexity = 'beginner' | 'intermediate'
type Modality = 'inPerson' | 'remote' | 'hybrid'
type ExampleType = 'correct' | 'erroneous' | 'both'

interface Step {
  title: string
  description?: string
  order: number
}

interface Answer {
  questionId: string
  answerId: string
  steps: Step[]
}

interface Axis {
  axisId: string
  answers: Answer[]
}

interface LessonPlan {
  lessonPlanId: string
  title: string
  description?: string
  subjectId: string
  topicId: string
  complexity?: Complexity
  year: string
  workload: string
  modality?: Modality
  contents: string[]
  materials: string[]
  priorKnowledge?: string
  example?: ExampleType
  isPublic: boolean
  approachId: string
  axes: Axis[]
}

interface ExtractPlanDataProps {
  payload: LessonPlan
}

interface MetadataProps {
  title: string
  description: string
  approach: string | undefined
  complexity: string
  example: string
  materials: string[]
  modality: string
  priorKnowledge: string
  subject: string | undefined
  topic: string | undefined
  workload: string
  year: string
  contents: string[]
}

interface AxisStepsProps {
  axisTitle?: string
  steps: Step[]
}

@Injectable()
export class PdfService {
  constructor(
    private approachService: ApproachService,
    private topicService: TopicService,
    private subjectService: SubjectService,
    private axisService: AxisService,
  ) {}

  async extractPlanData({ payload }: ExtractPlanDataProps) {
    if (!payload) {
      throw new Error('Payload é obrigatório')
    }

    const data = payload

    const approach = await this.approachService.findById(payload.approachId)
    const subject = await this.subjectService.findById(payload.subjectId)
    const topic = await this.topicService.findById(payload.topicId)

    const metadata = {
      title: data.title || 'Plano de Aula Sem Título',
      description: data.description || '',
      approach: approach?.title,
      complexity: data.complexity || '',
      example: data.example || '',
      materials: data.materials || [],
      modality: data.modality || '',
      priorKnowledge: data.priorKnowledge || '',
      subject: subject?.title,
      topic: topic?.title,
      workload: data.workload || '',
      year: data.year || '',
      contents: data.contents || [],
    }

    const axesSteps = await Promise.all(
      data.axes.map(async (axis: Axis) => {
        const axisFounded = await this.axisService.findById(axis.axisId)

        const lastAnswer = [...axis.answers]
          .reverse()
          .find(
            (a: Answer) =>
              a && a.steps && Array.isArray(a.steps) && a.steps.length > 0,
          )

        return {
          axisTitle: axisFounded?.title,
          steps: lastAnswer ? lastAnswer.steps : [],
        }
      }),
    )

    return { metadata, axesSteps }
  }

  async generatePdf(payload: LessonPlan, res: Response) {
    try {
      const { metadata, axesSteps } = await this.extractPlanData({
        payload,
      })
      const html = this.generateHtml(metadata, axesSteps)

      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      })

      const page = await browser.newPage()

      await page.setContent(html, {
        waitUntil: 'domcontentloaded',
      })

      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20px',
          right: '20px',
          bottom: '20px',
          left: '20px',
        },
        printBackground: true,
        displayHeaderFooter: false,
      })

      await browser.close()

      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader(
        'Content-Disposition',
        `inline; filename=${payload.title}-plano-de-aula.pdf`,
      )
      res.setHeader('Content-Length', pdfBuffer.length)

      res.send(pdfBuffer)
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      res.status(500).json({
        error: 'Erro interno do servidor ao gerar PDF',
        details: error.message,
      })
    }
  }

  generateHtml(metadata: MetadataProps, axesSteps: AxisStepsProps[]): string {
    const complexityMap = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
    }

    const modalityMap = {
      inPerson: 'Presencial',
      remote: 'Remoto',
      hybrid: 'Híbrido',
    }

    const exampleMap = {
      correct: 'Exemplos Corretos',
      erroneous: 'Exemplos Errôneos',
      both: 'Ambos',
    }

    return `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Plano de Aula</title>
          <style>
              * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
              }

              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  color: #000000;
                  background-color: #fff;
              }

              .container {
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 40px;
              }

              .header {
                  text-align: center;
                  margin-bottom: 20px;
                  padding-bottom: 20px;
              }

              .header h1 {
                  color: #000000;
                  font-size: 1.6em;
                  font-weight: 600;
                  margin-bottom: 5px;
              }

              .header .subtitle {
                  color: #000000;
                  font-size: 1.0em;
                  font-weight: 400;
              }

              .section {
                  margin-bottom: 15px;
                  background: #f8fafc;
                  border-radius: 12px;
                  padding: 20px;
              }

              .section-title {
                  color: #000000;
                  font-size: 1.0em;
                  font-weight: 400;
                  margin-bottom: 15px;
                  display: flex;
                  align-items: center;
              }

              .section-title::before {
                  content: '';
                  width: 4px;
                  height: 4px;
                  background-color: #000000;
                  border-radius: 50%;
                  margin-right: 10px;
              }
              
              .section p {
                font-size: 0.8em;
              }

              .metadata-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                  gap: 15px;
                  margin-bottom: 20px;
              }

              .metadata-item {
                  background: white;
                  padding: 15px;
                  border-radius: 8px;
                  border: 1px solid #e5e7eb;
              }

              .metadata-label {
                  font-weight: 600;
                  color: #000000;
                  font-size: 0.8em;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  margin-bottom: 5px;
              }

              .metadata-value {
                  color: #000000;
                  font-size: 0.8em;
              }

              .list-section {
                  background: white;
                  border-radius: 8px;
                  padding: 20px;
                  border: 1px solid #e5e7eb;
              }

              .list-section h3 {
                  color: #000000;
                  margin-bottom: 15px;
                  font-size: 1.2em;
                  font-weight: 400;
              }

              .list-section ul {
                  list-style: none;
                  font-size: 0.8em;
              }

              .list-section li {
                  padding: 8px 0;
                  border-bottom: 1px solid #f3f4f6;
                  position: relative;
                  padding-left: 20px;
              }

              .list-section li:before {
                  content: '•';
                  color: #000000;
                  font-weight: bold;
                  position: absolute;
                  left: 0;
              }

              .list-section li:last-child {
                  border-bottom: none;
              }

              .axis-section {
                  margin-bottom: 15px;
                  background: #f8fafc;
                  border-radius: 12px;
                  padding: 20px;
              }

              .axis-title {
                  color: #000000;
                  font-size: 1.0em;
                  font-weight: 400;
                  margin-bottom: 20px;
                  display: flex;
                  align-items: center;
              }

              .axis-number {
                  background: #000000;
                  color: white;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 15px;
                  font-weight: bold;
                  font-size: 0.6em;
              }

              .step-item {
                  background: white;
                  border: 1px solid #e5e7eb;
                  border-radius: 8px;
                  padding: 10px;
                  margin-bottom: 10px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }

              .step-title {
                  color: #000000;
                  font-weight: 400;
                  font-size: 0.8em;
                  margin-bottom: 10px;
              }

              .step-description {
                  color: #000000;
                  font-size: 0.8em;
                  line-height: 1.6;
              }

              .no-steps {
                  text-align: center;
                  color: #6b7280;
                  font-style: italic;
                  padding: 20px;
              }

              .footer {
                  text-align: center;
                  margin-top: 40px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                  color: #6b7280;
                  font-size: 0.9em;
              }

              @media print {
                  .container {
                      padding: 20px;
                  }
                  
                  .section {
                      break-inside: avoid;
                  }
                  
                  .axis-section {
                      break-inside: avoid;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>${metadata.title}</h1>
                  <div class="subtitle">Plano de Aula Detalhado</div>
                  <div class="subtitle">Abordagem ${metadata.approach}</div>
              </div>
              
              ${
                metadata.description
                  ? `
              <div class="section">
                  <div class="section-title">Descrição</div>
                  <p>${metadata.description}</p>
              </div>
              `
                  : ''
              }

              <div class="section">
                  <div class="section-title">Informações Gerais</div>
                  <div class="metadata-grid">
                      <div class="metadata-item">
                          <div class="metadata-label">Ano/Série</div>
                          <div class="metadata-value">${metadata.year}</div>
                      </div>

                      <div class="metadata-item">
                          <div class="metadata-label">Carga Horária</div>
                          <div class="metadata-value">${metadata.workload} horas</div>
                      </div>

                      <div class="metadata-item">
                          <div class="metadata-label">Disciplina</div>
                          <div class="metadata-value">${metadata.subject}</div>
                      </div>

                      <div class="metadata-item">
                          <div class="metadata-label">Tema</div>
                          <div class="metadata-value">${metadata.topic}</div>
                      </div>

                      ${
                        metadata.complexity
                          ? `
                      <div class="metadata-item">
                          <div class="metadata-label">Complexidade</div>
                          <div class="metadata-value">${complexityMap[metadata.complexity] || metadata.complexity}</div>
                      </div>
                      `
                          : ''
                      }

                      ${
                        metadata.modality
                          ? `
                      <div class="metadata-item">
                          <div class="metadata-label">Modalidade</div>
                          <div class="metadata-value">${modalityMap[metadata.modality] || metadata.modality}</div>
                      </div>
                      `
                          : ''
                      }

                      ${
                        metadata.example
                          ? `
                      <div class="metadata-item">
                          <div class="metadata-label">Tipo de Exemplo</div>
                          <div class="metadata-value">${exampleMap[metadata.example] || metadata.example}</div>
                      </div>
                      `
                          : ''
                      }
                  </div>
              </div>

              ${
                metadata.priorKnowledge
                  ? `
              <div class="section">
                  <div class="section-title">Conhecimentos Prévios</div>
                  <p>${metadata.priorKnowledge}</p>
              </div>
              `
                  : ''
              }

              ${
                metadata.contents && metadata.contents.length > 0
                  ? `
              <div class="section">
                  <div class="section-title">Conteúdos</div>
                  <div class="list-section">
                      <ul>
                          ${metadata.contents.map((content) => `<li>${content}</li>`).join('')}
                      </ul>
                  </div>
              </div>
              `
                  : ''
              }

              ${
                metadata.materials && metadata.materials.length > 0
                  ? `
              <div class="section">
                  <div class="section-title">Materiais e Recursos</div>
                  <div class="list-section">
                      <ul>
                          ${metadata.materials.map((material) => `<li>${material}</li>`).join('')}
                      </ul>
                  </div>
              </div>
              `
                  : ''
              }

              <div class="section">
                  <div class="section-title">Eixos Pedagógicos</div>
                  ${
                    axesSteps && axesSteps.length > 0
                      ? axesSteps
                          .map(
                            (axis, index) => `
                      <div class="axis-section">
                          <div class="axis-title">
                              <div class="axis-number">${index + 1}</div>
                              ${axis.axisTitle}
                          </div>
                          ${
                            axis.steps && axis.steps.length > 0
                              ? axis.steps
                                  .map(
                                    (step, stepIndex) => `
                              <div class="step-item">
                                  <div class="step-title">${stepIndex + 1}. ${step.title}</div>
                                  <div class="step-description">${step.description || ''}</div>
                              </div>
                              `,
                                  )
                                  .join('')
                              : '<div class="no-steps">Nenhum passo encontrado para este eixo.</div>'
                          }
                      </div>
                      `,
                          )
                          .join('')
                      : '<div class="no-steps">Nenhum eixo encontrado.</div>'
                  }
              </div>

              <div class="footer">
                  <p>Gerado em ${new Date().toLocaleDateString('pt-BR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}</p>
              </div>
          </div>
      </body>
      </html>
          `
  }
}
