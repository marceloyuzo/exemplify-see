import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Axis } from '@prisma/client'
import { PrismaService } from 'src/database/services/prisma.service'

interface CreateAxisProps {
  title: string
  approachId: string
}

interface DeleteAxisProps {
  id: string
}

interface GetAxisProps {
  id: string
}

interface GetAxisListProps {
  approachId: string
}

interface UpdateAxisProps {
  id: string
  title: string
}

@Injectable()
export class AxisService {
  constructor(private prisma: PrismaService) {}

  async createAxis({ title, approachId }: CreateAxisProps) {
    const isAxisAlreadyExists = await this.prisma.axis.findFirst({
      where: {
        title,
        approachesId: approachId,
      },
    })

    if (isAxisAlreadyExists) {
      throw new ConflictException(
        'Já existe um eixo com esse nome vinculado a essa abordagem.',
      )
    }

    const axis = await this.prisma.axis.create({
      data: {
        title,
        approachesId: approachId,
      },
    })

    return axis
  }

  async deleteAxis({ id }: DeleteAxisProps) {
    const isAxisExists = await this.prisma.axis.findUnique({
      where: {
        id,
      },
    })

    if (!isAxisExists) {
      throw new ConflictException('Não existe um eixo correspondente.')
    }

    await this.prisma.$transaction(async (prisma) => {
      await prisma.axis.delete({
        where: {
          id,
        },
      })

      await prisma.answer.deleteMany({
        where: {
          transition: { none: {} },
        },
      })
    })
  }

  async getAxis({ id }: GetAxisProps) {
    const axis = await this.prisma.axis.findUnique({
      where: {
        id,
      },
      include: {
        approache: {
          select: {
            title: true,
          },
        },
      },
    })

    if (!axis) {
      throw new NotFoundException('Não existe um eixo correspondente.')
    }

    return axis
  }

  async getAxisList({ approachId }: GetAxisListProps) {
    const isApproachExists = await this.prisma.approach.findUnique({
      where: {
        id: approachId,
      },
    })

    if (!isApproachExists) {
      throw new NotFoundException(
        'Não existe uma abordagem com esse identificador.',
      )
    }

    const axisList = await this.prisma.axis.findMany({
      where: {
        approachesId: approachId,
      },
      select: {
        id: true,
        title: true,
        approachesId: true,
      },
    })

    return axisList
  }

  async updateAxis({ id, title }: UpdateAxisProps) {
    const isAxisExists = await this.prisma.axis.findUnique({
      where: {
        id,
      },
    })

    if (!isAxisExists) {
      throw new ConflictException('Não existe um eixo correspondente.')
    }

    const axisUpdated = await this.prisma.axis.update({
      where: {
        id,
      },
      data: {
        title,
      },
    })

    return axisUpdated
  }

  async findById(id: string): Promise<Axis | null> {
    const axis = await this.prisma.axis.findUnique({
      where: {
        id,
      },
    })

    return axis
  }
}
