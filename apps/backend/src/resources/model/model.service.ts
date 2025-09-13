import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database/services/prisma.service'

interface CreateModelProps {
  title: string
}

interface DeleteModelProps {
  id: string
}

interface UpdateModelProps {
  id: string
  title: string
}

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async getModelOptions() {
    return await this.prisma.model.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    })
  }

  async createModel({ title }: CreateModelProps) {
    const model = await this.prisma.model.create({
      data: { title },
    })

    return model
  }

  async deleteModel({ id }: DeleteModelProps) {
    const isModelExists = await this.prisma.model.findUnique({
      where: {
        id,
      },
    })

    if (!isModelExists) {
      throw new NotFoundException(
        'Não existe uma disciplina com esse identificador.',
      )
    }

    await this.prisma.model.delete({
      where: {
        id,
      },
    })
  }

  async updateModel({ id, title }: UpdateModelProps) {
    const isModelExists = await this.prisma.model.findUnique({
      where: {
        id,
      },
    })

    if (!isModelExists) {
      throw new NotFoundException(
        'Não existe uma disciplina com esse identificador.',
      )
    }

    const model = await this.prisma.model.update({
      where: {
        id,
      },
      data: {
        title,
      },
    })

    return model
  }
}
