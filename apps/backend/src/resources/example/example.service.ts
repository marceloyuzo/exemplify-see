import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
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
  modelId?: string
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
  modelsId?: string[]
  exampleType: Example
  references?: string[]
  files: MulterFile[]
}

interface ApproveExampleProps {
  id: string
}

interface UpdateExampleProps {
  userId: string
  id: string
  title?: string
  description?: string
  references?: string[]
  exampleType?: Example
  modelsId?: string[]
  topicId?: string
  files?: MulterFile[]
  removeAttachmentIds?: string[]
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
    modelId,
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

    if (modelId) {
      where.exampleModel = {
        some: {
          modelId,
        },
      }
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

    const examplesWithRating = await Promise.all(
      examples.map(async (example) => {
        const rating = await this.prisma.rating.aggregate({
          where: { exampleId: example.id },
          _avg: { rate: true },
        })
        return { ...example, averageRating: rating._avg?.rate ?? null }
      }),
    )

    const total = await this.prisma.example.count({ where })

    return {
      data: examplesWithRating,
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
      if (example.attachment?.length) {
        await Promise.all(
          example.attachment.map((att) =>
            tx.attachment.delete({ where: { id: att.id } }),
          ),
        )
      }

      await tx.rating.deleteMany({ where: { exampleId } })
      await tx.exampleModel.deleteMany({ where: { exampleId } })

      await tx.example.delete({ where: { id: exampleId } })
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

    if (modelsId && modelsId.length > 0) {
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

  async updateExample({
    id,
    userId,
    title,
    description,
    references,
    exampleType,
    modelsId,
    topicId,
    files,
    removeAttachmentIds,
  }: UpdateExampleProps) {
    // Verificar se o exemplo existe
    const existingExample = await this.prisma.example.findUnique({
      where: { id },
      include: {
        exampleModel: true,
        attachment: true,
      },
    })

    if (!existingExample) {
      throw new NotFoundException('Exemplo não encontrado.')
    }

    if (existingExample.authorId !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar este exemplo.',
      )
    }

    if (topicId) {
      const isTopicExists = await this.prisma.topic.findUnique({
        where: { id: topicId },
      })

      if (!isTopicExists) {
        throw new NotFoundException(
          'Não existe um tema com essa identificação.',
        )
      }
    }

    if (modelsId && modelsId.length > 0) {
      for (const modelId of modelsId) {
        const isModelExists = await this.prisma.model.findUnique({
          where: { id: modelId },
        })

        if (!isModelExists) {
          throw new NotFoundException(`Modelo com id ${modelId} não existe`)
        }
      }
    }

    const updateData: Partial<{
      title: string
      description: string
      references: string[]
      type: Example
      topicId: string
      isApprove: boolean
    }> = {}

    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (references !== undefined) updateData.references = references
    if (exampleType !== undefined) updateData.type = exampleType
    if (topicId !== undefined) updateData.topicId = topicId

    // Resetar aprovação quando há alterações
    updateData.isApprove = false

    // Transação para garantir consistência
    await this.prisma.$transaction(async (tx) => {
      // 1. Atualizar dados básicos do exemplo
      const updatedExample = await tx.example.update({
        where: { id },
        data: updateData,
      })

      // 2. Atualizar relacionamentos com modelos (se fornecido)
      if (modelsId !== undefined) {
        // Remover relacionamentos existentes
        await tx.exampleModel.deleteMany({
          where: { exampleId: id },
        })

        // Criar novos relacionamentos
        if (modelsId.length > 0) {
          await tx.exampleModel.createMany({
            data: modelsId.map((modelId) => ({
              exampleId: id,
              modelId,
            })),
          })
        }
      }

      // 3. Remover attachments específicos (se fornecido)
      if (removeAttachmentIds && removeAttachmentIds.length > 0) {
        // Buscar attachments a serem removidos
        const attachmentsToRemove = await tx.attachment.findMany({
          where: {
            id: { in: removeAttachmentIds },
            exampleId: id,
          },
        })

        // Remover arquivos do storage
        for (const attachment of attachmentsToRemove) {
          try {
            await this.attachmentsService.remove(attachment.id)
          } catch (error) {
            this.logger.error(
              `Error deleting attachment ${attachment.id}:`,
              error,
            )
          }
        }

        // Remover registros do banco
        await tx.attachment.deleteMany({
          where: {
            id: { in: removeAttachmentIds },
            exampleId: id,
          },
        })
      }

      // 4. Adicionar novos attachments (se fornecidos)
      if (files && files.length > 0) {
        try {
          await Promise.all(
            files.map(async (file) => {
              const createAttachmentDto: CreateAttachmentDto = {
                title: file.originalname,
                customPath: `examples/${id}`,
              }

              const attachment = await this.attachmentsService.create(
                createAttachmentDto,
                file,
              )

              await tx.attachment.update({
                where: { id: attachment.id },
                data: { exampleId: id },
              })
            }),
          )
        } catch (error) {
          this.logger.error(
            `Error processing new attachments for example ${id}:`,
            error,
          )
          throw new InternalServerErrorException(
            'Erro ao processar novos anexos',
          )
        }
      }

      return updatedExample
    })

    // Retornar exemplo atualizado com relacionamentos
    return await this.prisma.example.findUnique({
      where: { id },
      include: {
        exampleModel: {
          include: {
            model: true,
          },
        },
        attachment: true,
        author: true,
        topic: true,
      },
    })
  }
}
