import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { $Enums, Prisma } from '@prisma/client'
import { PrismaService } from 'src/database/services/prisma.service'

interface FindManyExamplesProps {
  page: number
  perPage: number
  orderBy: string
  exampleName?: string
  topicId?: string
  exampleType?: 'correct' | 'erroneous'
}

interface DeleteExampleProps {
  userId: string
  role: $Enums.Roles
  exampleId: string
}

interface GetDetailedExampleProps {
  exampleId: string
}

@Injectable()
export class ExampleService {
  constructor(private prisma: PrismaService) {}

  async findManyExamples({
    page,
    perPage,
    orderBy,
    exampleName,
    exampleType,
    topicId,
  }: FindManyExamplesProps) {
    const where: Prisma.ExampleWhereInput = {}
    if (exampleName) {
      where.title = { contains: exampleName, mode: 'insensitive' }
    }

    if (exampleType) {
      where.type = { equals: exampleType }
    }

    if (topicId) {
      where.topicId = { equals: topicId }
    }

    const examples = await this.prisma.example.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        reference: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        author: {
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
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: orderBy === 'asc' ? 'asc' : 'desc' },
    })

    const total = await this.prisma.example.count({ where })

    return {
      data: examples,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async getDetailedExample({ exampleId }: GetDetailedExampleProps) {
    const example = await this.prisma.example.findUnique({
      where: {
        id: exampleId,
      },
      select: {
        id: true,
        title: true,
        description: true,
        reference: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        author: {
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
      },
    })

    if (!example) {
      throw new NotFoundException(
        'Não existe um exemplo com esse identificador.',
      )
    }

    return example
  }

  async deleteExample({ exampleId, role, userId }: DeleteExampleProps) {
    const isExampleExists = await this.prisma.example.findUnique({
      where: {
        id: exampleId,
      },
    })

    if (!isExampleExists) {
      throw new NotFoundException(
        'Não existe um exemplo com esse identificador.',
      )
    }

    if (isExampleExists.authorId !== userId && role !== 'admin') {
      throw new UnauthorizedException(
        'Você não possui permissão para realizar essa operação.',
      )
    }

    return await this.prisma.example.delete({
      where: {
        id: exampleId,
      },
    })
  }
}
