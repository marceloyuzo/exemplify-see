import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database/services/prisma.service'
import { StepProps, StepService } from '../step/step.service'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'

interface Answer {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date | null
}

interface CreateQuestionProps {
  axisId: string
  title: string
  optionA: string
  optionB: string
  optionC?: string
  parentTransitionId?: string
  stepsA: StepProps[]
  stepsB: StepProps[]
  stepsC?: StepProps[]
}

interface FindQuestionsByAxisIdProps {
  axisId: string
}

interface FindFirstQuestionProps {
  axisId: string
}

interface FindNextQuestionProps {
  answerId: string
}

interface FindQuestionDetailProps {
  questionId: string
}

interface PatchQuestionProps {
  questionId: string
  optionIdA: string
  optionIdB: string
  optionIdC?: string
  optionValueA: string
  optionValueB: string
  optionValueC?: string
  stepsA: StepProps[]
  stepsB: StepProps[]
  stepsC?: StepProps[]
  title: string
}

interface DeleteQuestionCascadeProps {
  questionId: string
}

@Injectable()
export class QuestionService {
  constructor(
    private prisma: PrismaService,
    private stepService: StepService,
  ) {}

  async createQuestion({
    axisId,
    title,
    optionA,
    optionB,
    optionC,
    parentTransitionId,
    stepsA,
    stepsB,
    stepsC,
  }: CreateQuestionProps) {
    const isAxisExists = await this.prisma.axis.findUnique({
      where: {
        id: axisId,
      },
    })

    if (!isAxisExists) {
      throw new NotFoundException('Não existe um eixo com esse identificador.')
    }

    const questionCreated = await this.prisma.$transaction(async (prisma) => {
      const question = await prisma.question.create({
        data: {
          title,
          axisId,
        },
      })

      const answerA = await prisma.answer.create({
        data: {
          title: optionA,
        },
      })

      const answerB = await prisma.answer.create({
        data: {
          title: optionB,
        },
      })

      let answerC: Answer | null = null
      if (optionC && optionC.trim()) {
        answerC = await prisma.answer.create({
          data: {
            title: optionC.trim(),
          },
        })
      }

      await this.stepService.createSteps(
        {
          answerId: answerA.id,
          steps: stepsA,
        },
        prisma,
      )

      await this.stepService.createSteps(
        {
          answerId: answerB.id,
          steps: stepsB,
        },
        prisma,
      )

      if (answerC && stepsC) {
        await this.stepService.createSteps(
          {
            answerId: answerC.id,
            steps: stepsC,
          },
          prisma,
        )
      }

      await prisma.transition.create({
        data: {
          answerId: answerA.id,
          fromQuestionId: question.id,
        },
      })

      await prisma.transition.create({
        data: {
          answerId: answerB.id,
          fromQuestionId: question.id,
        },
      })

      if (answerC) {
        await prisma.transition.create({
          data: {
            answerId: answerC.id,
            fromQuestionId: question.id,
          },
        })
      }

      if (parentTransitionId) {
        const transitionParent = await prisma.transition.findUnique({
          where: {
            id: parentTransitionId,
          },
        })

        if (!transitionParent) {
          throw new NotFoundException('Não existe essa relação entre questões.')
        }

        await prisma.transition.update({
          where: {
            id: transitionParent.id,
          },
          data: {
            toQuestionId: question.id,
          },
        })
      }

      return question
    })

    return questionCreated
  }

  async findQuestionsByAxisId({ axisId }: FindQuestionsByAxisIdProps) {
    const isAxisExists = await this.prisma.axis.findUnique({
      where: {
        id: axisId,
      },
    })

    if (!isAxisExists) {
      throw new NotFoundException('Não existe um eixo com esse identificador.')
    }

    const questions = await this.prisma.question.findMany({
      where: { axisId },
      include: {
        transitionsFromHere: {
          include: {
            answerValue: {
              select: {
                title: true,
              },
            },
          },
        },
        transitionToHere: {
          include: {
            answerValue: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    })

    return questions
  }

  async findFirstQuestion({ axisId }: FindFirstQuestionProps) {
    const isAxisExists = await this.prisma.axis.findUnique({
      where: {
        id: axisId,
      },
    })

    if (!isAxisExists) {
      throw new NotFoundException('Não existe um eixo com esse identificador.')
    }

    const question = await this.prisma.question.findFirst({
      where: {
        axisId,
        transitionToHere: null,
      },
      select: {
        id: true,
        title: true,
        transitionsFromHere: {
          select: {
            toQuestionId: true,
            answerValue: {
              select: {
                id: true,
                title: true,
                steps: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    order: true,
                  },
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

    return question
  }

  async findNextQuestion({ answerId }: FindNextQuestionProps) {
    const isAnswerExists = await this.prisma.answer.findUnique({
      where: {
        id: answerId,
      },
    })

    if (!isAnswerExists) {
      throw new NotFoundException(
        'Não existe uma resposta com esse identificador.',
      )
    }

    const question = await this.prisma.question.findFirst({
      where: {
        transitionToHere: {
          answerId,
        },
      },
      select: {
        id: true,
        title: true,
        transitionsFromHere: {
          select: {
            toQuestionId: true,
            answerValue: {
              select: {
                id: true,
                title: true,
                steps: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return question
  }

  async findQuestionDetail({ questionId }: FindQuestionDetailProps) {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        transitionsFromHere: {
          include: {
            answerValue: {
              select: {
                id: true,
                title: true,
                steps: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    order: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!question) {
      throw new NotFoundException(
        'Não existe uma questão com esse identificador.',
      )
    }

    return question
  }

  async patchQuestion({
    optionIdA,
    optionIdB,
    optionIdC,
    optionValueA,
    optionValueB,
    optionValueC,
    questionId,
    stepsA,
    stepsB,
    stepsC,
    title,
  }: PatchQuestionProps) {
    const isQuestionExists = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    })

    if (!isQuestionExists) {
      throw new NotFoundException(
        'Não existe uma questão com esse identificador.',
      )
    }

    const isAnswerAExists = await this.prisma.answer.findUnique({
      where: {
        id: optionIdA,
      },
    })

    const isAnswerBExists = await this.prisma.answer.findUnique({
      where: {
        id: optionIdB,
      },
    })

    if (!isAnswerAExists || !isAnswerBExists) {
      throw new NotFoundException(
        'Não existe uma resposta com esse identificador.',
      )
    }

    let isAnswerCExists: Answer | null = null
    if (optionIdC) {
      isAnswerCExists = await this.prisma.answer.findUnique({
        where: {
          id: optionIdC,
        },
      })

      if (!isAnswerCExists) {
        throw new NotFoundException(
          'Não existe uma resposta C com esse identificador.',
        )
      }
    }

    const questionUpdated = await this.prisma.$transaction(async (prisma) => {
      await this.stepService.syncSteps(prisma, stepsA, optionIdA)
      await this.stepService.syncSteps(prisma, stepsB, optionIdB)

      if (optionIdC && stepsC) {
        await this.stepService.syncSteps(prisma, stepsC, optionIdC)
      }

      const answerUpdates = [
        prisma.answer.update({
          where: { id: optionIdA },
          data: { title: optionValueA },
        }),
        prisma.answer.update({
          where: { id: optionIdB },
          data: { title: optionValueB },
        }),
      ]

      if (optionIdC && optionValueC) {
        answerUpdates.push(
          prisma.answer.update({
            where: { id: optionIdC },
            data: { title: optionValueC },
          }),
        )
      }

      await Promise.all(answerUpdates)

      return await prisma.question.update({
        where: { id: questionId },
        data: { title },
      })
    })

    return questionUpdated
  }

  async deleteQuestionRecursiveTransaction(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    id: string,
  ) {
    const transitions = await prisma.transition.findMany({
      where: { fromQuestionId: id },
      include: { toQuestion: true },
    })

    for (const t of transitions) {
      if (t.toQuestion) {
        await this.deleteQuestionRecursiveTransaction(prisma, t.toQuestion.id)
      }

      await prisma.answer.delete({
        where: {
          id: t.answerId,
        },
      })

      await prisma.step.deleteMany({
        where: {
          answerId: t.answerId,
        },
      })
    }

    await prisma.question.delete({
      where: { id },
    })
  }

  async deleteQuestionCascade({ questionId }: DeleteQuestionCascadeProps) {
    const isQuestionExists = await this.prisma.question.findUnique({
      where: {
        id: questionId,
      },
    })

    if (!isQuestionExists) {
      throw new NotFoundException(
        'Não existe uma questão com esse identificador.',
      )
    }

    await this.prisma.$transaction(async (prisma) => {
      await this.deleteQuestionRecursiveTransaction(prisma, questionId)
    })
  }
}
