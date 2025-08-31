import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { PrismaService } from 'src/database/services/prisma.service'
import { Prisma, User } from '@prisma/client'
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto'

interface GetHighlightsLessonPlansProps {
  userId: string
  myRepository: boolean
}

interface DeleteLessonPlanProps {
  user: User
  lessonPlanId: string
}

interface FindManyLessonPlanProps {
  userId: string
  page: number
  perPage: number
  orderBy: string
  myLessons?: boolean
  lessonPlanName?: string
  subjectId?: string
  topicId?: string
  complexity?: 'beginner' | 'intermediate'
  example?: 'correct' | 'erroneous'
}

@Injectable()
export class LessonPlanService {
  constructor(private prisma: PrismaService) {}

  async createLessonPlan(
    userId: string,
    createLessonPlanDto: CreateLessonPlanDto,
  ) {
    const {
      title,
      description,
      approachId,
      axes,
      isPublic,
      complexity,
      example,
      subjectId,
      topicId,
      contents,
      materials,
      modality,
      workload,
      year,
      priorKnowledge,
    } = createLessonPlanDto

    return await this.prisma.$transaction(async (prisma) => {
      // Criar o plano de aula principal
      const lessonPlan = await prisma.lessonPlan.create({
        data: {
          modality,
          workload,
          year,
          contents,
          materials,
          priorKnowledge,
          title,
          description,
          userId,
          approachId,
          isPublic,
          complexity,
          example,
          subjectId,
          topicId,
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

  async deleteLessonPlan({ lessonPlanId, user }: DeleteLessonPlanProps) {
    const isLessonPlanExists = await this.prisma.lessonPlan.findUnique({
      where: {
        id: lessonPlanId,
      },
    })

    if (!isLessonPlanExists) {
      throw new NotFoundException(
        'Não existe um plano de aula com esse identificador.',
      )
    }

    if (user.role !== 'admin' && isLessonPlanExists.userId !== user.id) {
      throw new UnauthorizedException(
        'Você não possui permissão para realizar essa operação.',
      )
    }

    return await this.prisma.lessonPlan.delete({
      where: {
        id: lessonPlanId,
      },
    })
  }

  async getHighlightsLessonPlans({
    userId,
    myRepository,
  }: GetHighlightsLessonPlansProps) {
    const where: Prisma.LessonPlanWhereInput = {}

    if (myRepository) {
      where.userId = { contains: userId, mode: 'insensitive' }
    } else {
      where.NOT = { userId: { equals: userId } }
      where.isPublic = {
        equals: true,
      }
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
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
      },
    })

    return lessonsPlans
  }

  async getLessonPlanById(id: string, userId: string) {
    const lessonPlan = await this.prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        axes: {
          include: {
            answers: {
              include: {
                steps: {
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
        approach: {
          select: {
            id: true,
            title: true,
          },
        },
        subject: {
          select: {
            id: true,
            title: true,
          },
        },
        topic: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!lessonPlan) {
      throw new NotFoundException(
        'Não existe um plano de aula com esse identificador.',
      )
    }

    if (!lessonPlan.isPublic && lessonPlan.user.id !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para realizar essa ação.',
      )
    }

    const complexityLabelMap = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
    }

    const exampleLabelMap = {
      correct: 'Correto',
      erroneous: 'Errado',
    }

    const modalityLabelMap = {
      inPerson: 'Presencial',
      hybrid: 'Híbrido',
      remote: 'Remoto',
    }

    const lessonPlanWithAverageRating = await this.prisma.rating.aggregate({
      where: { lessonPlanId: id },
      _avg: { rate: true },
    })

    return {
      ...lessonPlan,
      complexityLabel: lessonPlan.complexity
        ? complexityLabelMap[lessonPlan.complexity]
        : null,
      exampleLabel: lessonPlan.example
        ? exampleLabelMap[lessonPlan.example]
        : null,
      modalityLabel: lessonPlan.modality
        ? modalityLabelMap[lessonPlan.modality]
        : null,
      averageRating: lessonPlanWithAverageRating._avg?.rate ?? null,
    }
  }

  async updateLessonPlan(id: string, payload: UpdateLessonPlanDto) {
    const { axes, ...lessonPlanData } = payload

    // Usar transaction para garantir consistência
    const updatedLessonPlan = await this.prisma.$transaction(async (tx) => {
      // 1. Atualizar dados do plano de aula
      const lessonPlan = await tx.lessonPlan.update({
        where: { id },
        data: {
          ...lessonPlanData,
          updatedAt: new Date(),
        },
      })

      // 2. Remover todos os eixos existentes (cascade vai remover answers e steps)
      await tx.lessonPlanAxis.deleteMany({
        where: { lessonPlanId: id },
      })

      // 3. Recriar eixos com novos dados
      for (const axisData of axes) {
        const createdAxis = await tx.lessonPlanAxis.create({
          data: {
            lessonPlanId: id,
            axisId: axisData.axisId,
          },
        })

        // Criar answers para este eixo
        for (const answerData of axisData.answers) {
          const createdAnswer = await tx.lessonPlanAnswer.create({
            data: {
              lessonPlanAxisId: createdAxis.id,
              questionId: answerData.questionId,
              answerId: answerData.answerId,
            },
          })

          // Criar steps para esta resposta
          if (answerData.steps && answerData.steps.length > 0) {
            await tx.lessonPlanStep.createMany({
              data: answerData.steps.map((step) => ({
                lessonPlanAnswerId: createdAnswer.id,
                title: step.title,
                description: step.description,
                order: step.order,
              })),
            })
          }
        }
      }

      return lessonPlan
    })

    return updatedLessonPlan
  }

  async findManyLessonsPlan({
    userId,
    page,
    perPage,
    orderBy,
    lessonPlanName,
    complexity,
    myLessons,
    example,
    subjectId,
    topicId,
  }: FindManyLessonPlanProps) {
    const where: Prisma.LessonPlanWhereInput = {}
    if (lessonPlanName) {
      where.title = { contains: lessonPlanName, mode: 'insensitive' }
    }

    if (complexity) {
      where.complexity = { equals: complexity }
    }

    if (example) {
      where.example = { equals: example }
    }

    if (subjectId) {
      where.subjectId = { equals: subjectId }
    }

    if (topicId) {
      where.topicId = { equals: topicId }
    }

    if (myLessons) {
      where.userId = { contains: userId, mode: 'insensitive' }
    } else {
      where.NOT = { userId: { equals: userId } }
      where.isPublic = {
        equals: true,
      }
    }

    const lessonPlans = await this.prisma.lessonPlan.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: orderBy === 'asc' ? 'asc' : 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
      },
    })

    const total = await this.prisma.lessonPlan.count({ where })

    return {
      data: lessonPlans,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }
}
