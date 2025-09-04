import { Injectable } from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { DefaultArgs } from '@prisma/client/runtime/library'
import { PrismaService } from 'src/database/services/prisma.service'

export interface StepProps {
  id: string
  title: string
  description?: string
  order: number
}

interface CreateStepsProps {
  steps: StepProps[]
  answerId: string
}

@Injectable()
export class StepService {
  constructor(private prisma: PrismaService) {}

  async createSteps(
    { steps, answerId }: CreateStepsProps,
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ) {
    await Promise.all(
      steps.map((step) =>
        prisma.step.create({
          data: {
            id: step.id,
            title: step.title,
            description: step.description,
            order: step.order,
            answerId,
          },
        }),
      ),
    )
  }

  async syncSteps(
    prisma: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    steps: StepProps[],
    answerId: string,
  ): Promise<void> {
    const existingSteps = await prisma.step.findMany({
      where: {
        answerId,
      },
      select: {
        id: true,
      },
    })

    const existingStepIds = existingSteps.map((step) => step.id)
    const newStepIds = steps.map((step) => step.id)

    const stepsToDelete = existingStepIds.filter(
      (id) => !newStepIds.includes(id),
    )

    if (stepsToDelete.length > 0) {
      await prisma.step.deleteMany({
        where: {
          id: {
            in: stepsToDelete,
          },
        },
      })
    }

    await Promise.all(
      steps.map((step) =>
        prisma.step.upsert({
          where: {
            id: step.id,
          },
          update: {
            title: step.title,
            description: step.description,
            order: step.order,
          },
          create: {
            id: step.id,
            title: step.title,
            description: step.description,
            order: step.order,
            answerId,
          },
        }),
      ),
    )
  }
}
