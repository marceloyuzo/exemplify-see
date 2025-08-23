import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { PrismaService } from 'src/database/services/prisma.service'
import { Prisma } from '@prisma/client'

interface GetHighlightsLessonPlansProps {
  userId: string
  myRepository: boolean
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
    } = createLessonPlanDto

    return await this.prisma.$transaction(async (prisma) => {
      // Criar o plano de aula principal
      const lessonPlan = await prisma.lessonPlan.create({
        data: {
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

  async getHighlightsLessonPlans({
    userId,
    myRepository,
  }: GetHighlightsLessonPlansProps) {
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
      where: {
        id,
      },
      select: {
        id: true,
        title: true,
        description: true,
        complexity: true,
        example: true,
        isPublic: true,
        approachId: true,
        createdAt: true,
        updatedAt: true,
        axes: true,
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
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
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

    return {
      ...lessonPlan,
      complexityLabel: lessonPlan.complexity
        ? complexityLabelMap[lessonPlan.complexity]
        : null,
      exampleLabel: lessonPlan.example
        ? exampleLabelMap[lessonPlan.example]
        : null,
    }
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
      where.isPublic = true
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
