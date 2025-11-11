import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { PrismaService } from 'src/database/services/prisma.service'
import { LessonPlanAnswer, Prisma, User } from '@prisma/client'
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto'

interface Axis {
  lessonPlanId: string
  id: string
  createdAt: Date
  updatedAt: Date | null
  axisId: string
  lastQuestionId: string | null
}

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

interface FindManyLessonPlanAdminProps {
  page: number
  perPage: number
  orderBy: string
  lessonPlanName?: string
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

    const axisLastQuestions = await Promise.all(
      axes.map(async (axisData) => {
        let lastQuestionId: string | null = null

        for (const answerData of axisData.answers) {
          const lastTransition = await this.prisma.transition.findFirst({
            where: {
              answerId: answerData.answerId,
              fromQuestionId: answerData.questionId,
              toQuestionId: null,
            },
            select: { fromQuestionId: true },
          })

          if (lastTransition) {
            lastQuestionId = lastTransition.fromQuestionId
          }
        }

        return {
          axisId: axisData.axisId,
          lastQuestionId,
          answers: axisData.answers,
        }
      }),
    )

    return await this.prisma.$transaction(async (tx) => {
      const lessonPlan = await tx.lessonPlan.create({
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

      for (const axisData of axisLastQuestions) {
        const lessonPlanAxis = await tx.lessonPlanAxis.create({
          data: {
            lessonPlanId: lessonPlan.id,
            axisId: axisData.axisId,
            lastQuestionId: axisData.lastQuestionId,
          },
        })

        for (const answerData of axisData.answers) {
          const lessonPlanAnswer = await tx.lessonPlanAnswer.create({
            data: {
              lessonPlanAxisId: lessonPlanAxis.id,
              questionId: answerData.questionId,
              answerId: answerData.answerId,
            },
          })

          if (answerData.steps && answerData.steps.length > 0) {
            await tx.lessonPlanStep.createMany({
              data: answerData.steps.map((step) => ({
                lessonPlanAnswerId: lessonPlanAnswer.id,
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
        topic: {
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
        modality: true,
        workload: true,
        year: true,
        example: true,
        complexity: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
      },
    })

    const complexityLabelMap = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
    }

    const exampleLabelMap = {
      correct: 'Correto',
      erroneous: 'Errado',
      both: 'Ambos',
    }

    const modalityLabelMap = {
      inPerson: 'Presencial',
      hybrid: 'Híbrido',
      remote: 'Remoto',
    }

    const lessonPlansWithRating = await Promise.all(
      lessonsPlans.map(async (plan) => {
        const rating = await this.prisma.rating.aggregate({
          where: { lessonPlanId: plan.id },
          _avg: { rate: true },
        })

        return {
          ...plan,
          complexity: plan.complexity
            ? complexityLabelMap[plan.complexity]
            : null,
          example: plan.example ? exampleLabelMap[plan.example] : null,
          modality: plan.modality ? modalityLabelMap[plan.modality] : null,
          averageRating: rating._avg?.rate ?? null,
        }
      }),
    )

    return lessonPlansWithRating
  }

  async getLessonPlanById(id: string, userId: string): Promise<any> {
    const lessonPlan = await this.prisma.lessonPlan.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, photoURL: true },
        },
        approach: { select: { id: true, title: true } },
        subject: { select: { id: true, title: true } },
        topic: { select: { id: true, title: true } },
        axes: true,
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
      both: 'Ambos',
    }

    const modalityLabelMap = {
      inPerson: 'Presencial',
      hybrid: 'Híbrido',
      remote: 'Remoto',
    }

    const averageRating = await this.prisma.rating.aggregate({
      where: { lessonPlanId: id },
      _avg: { rate: true },
    })

    const axes: Axis[] = []
    for (const axis of lessonPlan.axes) {
      const fullAxis = await this.buildAxisBacktrack(axis)
      axes.push(fullAxis)
    }

    return {
      ...lessonPlan,
      axes,
      complexityLabel: lessonPlan.complexity
        ? complexityLabelMap[lessonPlan.complexity]
        : null,
      exampleLabel: lessonPlan.example
        ? exampleLabelMap[lessonPlan.example]
        : null,
      modalityLabel: lessonPlan.modality
        ? modalityLabelMap[lessonPlan.modality]
        : null,
      averageRating: averageRating._avg?.rate ?? null,
    }
  }

  private async buildAxisBacktrack(axis: Axis) {
    const { id: lessonPlanAxisId, lastQuestionId } = axis

    if (!lastQuestionId) {
      return { ...axis, answers: [] }
    }

    const answers: LessonPlanAnswer[] = []
    let currentQuestionId: string | null = lastQuestionId

    while (currentQuestionId) {
      const lessonPlanAnswer = await this.prisma.lessonPlanAnswer.findFirst({
        where: {
          lessonPlanAxisId,
          questionId: currentQuestionId,
        },
        include: {
          steps: { orderBy: { order: 'asc' } },
        },
      })

      if (lessonPlanAnswer) {
        answers.unshift(lessonPlanAnswer)
      }

      const transition = await this.prisma.transition.findFirst({
        where: { toQuestionId: currentQuestionId },
        select: { fromQuestionId: true },
      })

      currentQuestionId = transition?.fromQuestionId ?? null
    }

    return {
      ...axis,
      answers,
    }
  }

  async updateLessonPlan(id: string, payload: UpdateLessonPlanDto) {
    const { axes, ...lessonPlanData } = payload

    const axisLastQuestions = await Promise.all(
      axes.map(async (axisData) => {
        let lastQuestionId: string | null = null

        for (const answerData of axisData.answers) {
          const lastTransition = await this.prisma.transition.findFirst({
            where: {
              answerId: answerData.answerId,
              fromQuestionId: answerData.questionId,
              toQuestionId: null,
            },
            select: { fromQuestionId: true },
          })

          if (lastTransition) {
            lastQuestionId = lastTransition.fromQuestionId
          }
        }

        return {
          axisId: axisData.axisId,
          lastQuestionId,
          answers: axisData.answers,
        }
      }),
    )

    const updatedLessonPlan = await this.prisma.$transaction(async (tx) => {
      const lessonPlan = await tx.lessonPlan.update({
        where: { id },
        data: {
          ...lessonPlanData,
          updatedAt: new Date(),
        },
      })

      await tx.lessonPlanAxis.deleteMany({
        where: { lessonPlanId: id },
      })

      for (const axisData of axisLastQuestions) {
        const lessonPlanAxis = await tx.lessonPlanAxis.create({
          data: {
            lessonPlanId: id,
            axisId: axisData.axisId,
            lastQuestionId: axisData.lastQuestionId,
          },
        })

        for (const answerData of axisData.answers) {
          const lessonPlanAnswer = await tx.lessonPlanAnswer.create({
            data: {
              lessonPlanAxisId: lessonPlanAxis.id,
              questionId: answerData.questionId,
              answerId: answerData.answerId,
            },
          })

          if (answerData.steps && answerData.steps.length > 0) {
            await tx.lessonPlanStep.createMany({
              data: answerData.steps.map((step) => ({
                lessonPlanAnswerId: lessonPlanAnswer.id,
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

  async findManyLessonsPlanAdmin({
    page,
    perPage,
    orderBy,
    lessonPlanName,
  }: FindManyLessonPlanAdminProps) {
    const where: Prisma.LessonPlanWhereInput = {}
    if (lessonPlanName) {
      where.title = { contains: lessonPlanName, mode: 'insensitive' }
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
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
        topic: {
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
        modality: true,
        workload: true,
        year: true,
        example: true,
        complexity: true,
      },
    })

    const complexityLabelMap = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
    }

    const exampleLabelMap = {
      correct: 'Correto',
      erroneous: 'Errado',
      both: 'Ambos',
    }

    const modalityLabelMap = {
      inPerson: 'Presencial',
      hybrid: 'Híbrido',
      remote: 'Remoto',
    }

    const lessonPlansWithRating = await Promise.all(
      lessonPlans.map(async (plan) => {
        const rating = await this.prisma.rating.aggregate({
          where: { lessonPlanId: plan.id },
          _avg: { rate: true },
        })

        return {
          ...plan,
          complexity: plan.complexity
            ? complexityLabelMap[plan.complexity]
            : null,
          example: plan.example ? exampleLabelMap[plan.example] : null,
          modality: plan.modality ? modalityLabelMap[plan.modality] : null,
          averageRating: rating._avg?.rate ?? null,
        }
      }),
    )

    const total = await this.prisma.lessonPlan.count({ where })

    return {
      data: lessonPlansWithRating,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
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
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
        topic: {
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
        modality: true,
        workload: true,
        year: true,
        example: true,
        complexity: true,
      },
    })

    const complexityLabelMap = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
    }

    const exampleLabelMap = {
      correct: 'Correto',
      erroneous: 'Errado',
      both: 'Ambos',
    }

    const modalityLabelMap = {
      inPerson: 'Presencial',
      hybrid: 'Híbrido',
      remote: 'Remoto',
    }

    const lessonPlansWithRating = await Promise.all(
      lessonPlans.map(async (plan) => {
        const rating = await this.prisma.rating.aggregate({
          where: { lessonPlanId: plan.id },
          _avg: { rate: true },
        })

        return {
          ...plan,
          complexity: plan.complexity
            ? complexityLabelMap[plan.complexity]
            : null,
          example: plan.example ? exampleLabelMap[plan.example] : null,
          modality: plan.modality ? modalityLabelMap[plan.modality] : null,
          averageRating: rating._avg?.rate ?? null,
        }
      }),
    )

    const total = await this.prisma.lessonPlan.count({ where })

    return {
      data: lessonPlansWithRating,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async getInformationsToPdf(id: string) {
    const informationLessonPlanToPdf = await this.prisma.lessonPlan.findUnique({
      where: {
        id,
      },
      select: {
        title: true,
        approach: {
          select: {
            title: true,
          },
        },
        description: true,
        year: true,
        workload: true,
        subject: {
          select: {
            title: true,
          },
        },
        topic: {
          select: {
            title: true,
          },
        },
        complexity: true,
        modality: true,
        example: true,
        priorKnowledge: true,
        contents: true,
        materials: true,
        axes: {
          select: {
            axis: {
              select: {
                title: true,
              },
            },
            answers: {
              select: {
                steps: true,
              },
            },
          },
        },
      },
    })

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

    const processedAxes =
      informationLessonPlanToPdf?.axes.map((axis) => {
        const lastAnswer = [...axis.answers]
          .reverse()
          .find((a) => a?.steps && a.steps.length > 0)

        return {
          axisTitle: axis.axis.title,
          steps: lastAnswer ? lastAnswer.steps : [],
        }
      }) ?? []

    return {
      ...informationLessonPlanToPdf,
      axes: processedAxes,
      complexityLabel: informationLessonPlanToPdf?.complexity
        ? complexityLabelMap[informationLessonPlanToPdf.complexity]
        : null,
      exampleLabel: informationLessonPlanToPdf?.example
        ? exampleLabelMap[informationLessonPlanToPdf.example]
        : null,
      modalityLabel: informationLessonPlanToPdf?.modality
        ? modalityLabelMap[informationLessonPlanToPdf.modality]
        : null,
    }
  }
}
