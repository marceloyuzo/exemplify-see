import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from 'generated/prisma'
import { PrismaService } from 'src/database/services/prisma.service'

interface CreateApproachProps {
  title: string
}

interface EditApproachProps {
  id: string
  title: string
}

interface DeleteApproachprops {
  id: string
}

interface FindManyApproachesProps {
  page: number
  perPage: number
  orderBy: string
  approachName?: string
}

interface GetApproachDetailsProps {
  id: string
}

@Injectable()
export class ApproachService {
  constructor(private prisma: PrismaService) {}

  async createApproach({ title }: CreateApproachProps) {
    const isApproachAlreadyExists = await this.prisma.approach.findFirst({
      where: {
        title,
      },
    })

    if (isApproachAlreadyExists) {
      throw new ConflictException('Já existe uma abordagem com esse nome.')
    }

    const approach = await this.prisma.approach.create({
      data: {
        title,
      },
    })

    return approach
  }

  async editApproach({ id, title }: EditApproachProps) {
    const isApproachAlreadyExists = await this.prisma.approach.findFirst({
      where: {
        id,
      },
    })

    if (!isApproachAlreadyExists) {
      throw new NotFoundException(
        'Não existe uma abordagem com esse identificador.',
      )
    }

    const approachEdited = await this.prisma.approach.update({
      where: {
        id,
      },
      data: {
        title,
      },
    })

    return approachEdited
  }

  async deleteApproach({ id }: DeleteApproachprops) {
    const isApproachExists = await this.prisma.approach.findFirst({
      where: {
        id,
      },
    })

    if (!isApproachExists) {
      throw new NotFoundException(
        'Não existe uma abordagem com esse identificador.',
      )
    }

    const approachDeleted = await this.prisma.approach.delete({
      where: {
        id,
      },
    })

    return approachDeleted
  }

  async getApproachDetails({ id }: GetApproachDetailsProps) {
    const isApproachExists = await this.prisma.approach.findUnique({
      where: {
        id,
      },
      include: {
        axis: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!isApproachExists) {
      throw new NotFoundException(
        'Não existe uma abordagem com esse identificador.',
      )
    }

    return isApproachExists
  }

  async findManyApproaches({
    page,
    perPage,
    orderBy,
    approachName,
  }: FindManyApproachesProps) {
    const where: Prisma.ApproachWhereInput = {}
    if (approachName) {
      where.title = { contains: approachName, mode: 'insensitive' }
    }

    const approaches = await this.prisma.approach.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: orderBy === 'asc' ? 'asc' : 'desc' },
      include: {
        axis: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    const total = await this.prisma.approach.count({ where })

    return {
      data: approaches,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }
}
