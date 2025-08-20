import { Injectable } from '@nestjs/common'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { PrismaService } from 'src/database/services/prisma.service'
import { Prisma } from 'generated/prisma'

interface GetHighlightsLessonPlansProps {
  userId: string
  myRepository: boolean
}

@Injectable()
export class LessonPlanService {
  constructor(private prisma: PrismaService) {}

  async createLessonPlan(
    userId: string,
    createLessonPlanDto: CreateLessonPlanDto,
  ) {
    const { title, description, approachId, axes } = createLessonPlanDto

    return await this.prisma.$transaction(async (prisma) => {
      // Criar o plano de aula principal
      const lessonPlan = await prisma.lessonPlan.create({
        data: {
          title,
          description,
          userId,
          approachId,
        },
      })

      // Criar os eixos do plano
      for (const axisData of axes) {
        const lessonPlanAxis = await prisma.lessonPlanAxis.create({
          data: {
            lessonPlanId: lessonPlan.id,
            axisId: axisData.axisId,
          },
        })

        // Criar as respostas para cada eixo
        for (const answerData of axisData.answers) {
          const lessonPlanAnswer = await prisma.lessonPlanAnswer.create({
            data: {
              lessonPlanAxisId: lessonPlanAxis.id,
              questionId: answerData.questionId,
              answerId: answerData.answerId,
            },
          })

          // Criar os steps para cada resposta
          for (const stepData of answerData.steps) {
            await prisma.lessonPlanStep.create({
              data: {
                lessonPlanAnswerId: lessonPlanAnswer.id,
                title: stepData.title,
                description: stepData.description,
                order: stepData.order,
              },
            })
          }
        }
      }

      return lessonPlan
    })
  }

  async getHighlightsLessonPlans({ userId, myRepository }: GetHighlightsLessonPlansProps) {
    const where: Prisma.LessonPlanWhereInput = {}

    if (myRepository) {
      where.userId = { contains: userId, mode: 'insensitive' }
    } else {
      where.NOT = { userId: { equals: userId } }
    }

    const lessonsPlans = await this.prisma.lessonPlan.findMany({
      where,
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
      },
    })

    return lessonsPlans
  }

  async getLessonPlanById(id: string, userId: string) {
    return await this.prisma.lessonPlan.findFirst({
      where: { id, userId },
      include: {
        approach: {
          select: {
            id: true,
            title: true,
          },
        },
        axes: {
          include: {
            axis: {
              select: {
                id: true,
                title: true,
              },
            },
            answers: {
              include: {
                question: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                answer: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
                steps: {
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    })
  }
}
