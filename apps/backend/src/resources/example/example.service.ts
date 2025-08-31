import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { $Enums, Prisma } from '@prisma/client'
import { PrismaService } from 'src/database/services/prisma.service'
import { Example } from '../lesson-plan/dto/create-lesson-plan.dto'
import { CreateAttachmentDto } from '../attachment/dto/create-attachment.dto'
import {
  AttachmentsService,
  MulterFile,
} from '../attachment/attachment.service'

interface FindManyExamplesProps {
  page: number
  perPage: number
  orderBy: string
  exampleName?: string
  topicId?: string
  exampleType?: 'correct' | 'erroneous'
  admin: boolean
}

interface DeleteExampleProps {
  userId: string
  role: $Enums.Roles
  exampleId: string
}

interface GetDetailedExampleProps {
  exampleId: string
}

interface CreateExampleProps {
  title: string
  description: string
  authorId: string
  topicId: string
  modelsId: string[]
  exampleType: Example
  references: string[]
  files: MulterFile[]
}

interface ApproveExampleProps {
  id: string
}

@Injectable()
export class ExampleService {
  private readonly logger = new Logger(ExampleService.name)
  constructor(
    private prisma: PrismaService,
    private attachmentsService: AttachmentsService,
  ) {}

  async findManyExamples({
    page,
    perPage,
    orderBy,
    exampleName,
    exampleType,
    topicId,
    admin,
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

    if (!admin) {
      where.isApprove = true
    }

    const examples = await this.prisma.example.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        references: true,
        type: true,
        isApprove: !!admin,
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
      orderBy: admin
        ? [
            { isApprove: 'asc' },
            { createdAt: orderBy === 'asc' ? 'asc' : 'desc' },
          ]
        : { createdAt: orderBy === 'asc' ? 'asc' : 'desc' },
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

  async approveExample({ id }: ApproveExampleProps) {
    const isExampleExists = await this.prisma.example.findUnique({
      where: {
        id,
      },
    })

    if (!isExampleExists) {
      throw new NotFoundException(
        'Não existe um exemplo com esse identificador.',
      )
    }

    if (isExampleExists.isApprove) {
      throw new ConflictException('O exemplo já está aprovado.')
    }

    const exampleUpdated = await this.prisma.example.update({
      where: {
        id,
      },
      data: {
        isApprove: true,
      },
    })

    return exampleUpdated
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
        references: true,
        exampleModel: {
          select: {
            model: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
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
        attachment: {
          select: {
            id: true,
            title: true,
            url: true,
            type: true,
          },
        },
      },
    })

    if (!example) {
      throw new NotFoundException(
        'Não existe um exemplo com esse identificador.',
      )
    }

    const exampleWithAverageRating = await this.prisma.rating.aggregate({
      where: { exampleId },
      _avg: { rate: true },
    })

    const exampleWithAvg = {
      ...example,
      averageRating: exampleWithAverageRating._avg?.rate ?? null,
    }

    return exampleWithAvg
  }

  async deleteExample({ exampleId, role, userId }: DeleteExampleProps) {
    const example = await this.prisma.example.findUnique({
      where: {
        id: exampleId,
      },
      include: {
        attachment: true,
      },
    })

    if (!example) {
      throw new NotFoundException(
        'Não existe um exemplo com esse identificador.',
      )
    }

    if (example.authorId !== userId && role !== 'admin') {
      throw new UnauthorizedException(
        'Você não possui permissão para realizar essa operação.',
      )
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.exampleModel.deleteMany({
        where: { exampleId },
      })

      await tx.rating.deleteMany({
        where: { exampleId },
      })

      tx.example.delete({
        where: { id: exampleId },
      })

      if (example.attachment?.length) {
        await Promise.all(
          example.attachment.map((att) =>
            tx.attachment.delete({ where: { id: att.id } }),
          ),
        )
      }
    })
  }

  async createExample({
    description,
    references,
    authorId,
    title,
    exampleType,
    modelsId,
    topicId,
    files,
  }: CreateExampleProps) {
    const isTopicExists = await this.prisma.topic.findUnique({
      where: {
        id: topicId,
      },
    })

    if (!isTopicExists) {
      throw new NotFoundException('Não existe um tema com essa identificação.')
    }

    if (modelsId.length > 0) {
      for (const modelId of modelsId) {
        const isModelExists = await this.prisma.model.findUnique({
          where: { id: modelId },
        })

        if (!isModelExists) {
          throw new Error(`Modelo com id ${modelId} não existe`)
        }
      }
    }

    const example = await this.prisma.example.create({
      data: {
        title,
        description,
        authorId,
        topicId,
        isApprove: false,
        references,
        type: exampleType,
        exampleModel: modelsId?.length
          ? {
              create: modelsId.map((modelId) => ({ modelId })),
            }
          : undefined,
      },
      include: {
        exampleModel: true,
      },
    })

    if (files && files.length > 0) {
      try {
        await Promise.all(
          files.map(async (file) => {
            const createAttachmentDto: CreateAttachmentDto = {
              title: file.originalname,
              customPath: `examples/${example.id}`,
            }

            const attachment = await this.attachmentsService.create(
              createAttachmentDto,
              file,
            )

            const updatedAttachment = await this.prisma.attachment.update({
              where: { id: attachment.id },
              data: { exampleId: example.id },
            })

            return updatedAttachment
          }),
        )
      } catch (error) {
        this.logger.error(
          `Error processing attachments for example ${example.id}:`,
          error,
        )

        this.logger.warn(
          `Example ${example.id} created but some attachments failed`,
        )
      }
    }
  }
}
