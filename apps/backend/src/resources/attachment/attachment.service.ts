import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/database/services/prisma.service'
import { R2Service } from 'src/storage/r2.service'
import { CreateAttachmentDto } from './dto/create-attachment.dto'

export interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  buffer: Buffer
}

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger(AttachmentsService.name)

  constructor(
    private prisma: PrismaService,
    private r2Service: R2Service,
  ) {}

  async create(createAttachmentDto: CreateAttachmentDto, file: MulterFile) {
    try {
      // Upload do arquivo para o R2
      const { key, url } = await this.r2Service.uploadFile(
        file,
        createAttachmentDto.customPath,
      )

      // Salvar informações no banco de dados
      const attachment = await this.prisma.attachment.create({
        data: {
          title: createAttachmentDto.title,
          type: file.mimetype,
          url,
          key,
          size: file.size,
        },
      })

      this.logger.log(`Attachment created with ID: ${attachment.id}`)
      return attachment
    } catch (error) {
      this.logger.error('Error creating attachment:', error)
      throw error
    }
  }

  // async findAll(): Promise<AttachmentResponseDto[]> {
  //   const attachments = await this.prisma.attachment.findMany({
  //     orderBy: { createdAt: 'desc' },
  //   });

  //   return attachments.map(attachment => new AttachmentResponseDto(attachment));
  // }

  // async findOne(id: string): Promise<AttachmentResponseDto> {
  //   const attachment = await this.prisma.attachment.findUnique({
  //     where: { id },
  //   });

  //   if (!attachment) {
  //     throw new NotFoundException(`Attachment with ID ${id} not found`);
  //   }

  //   return new AttachmentResponseDto(attachment);
  // }

  async remove(id: string): Promise<void> {
    try {
      // Buscar o attachment no banco de dados
      const attachment = await this.prisma.attachment.findUnique({
        where: { id },
      })

      if (!attachment) {
        throw new NotFoundException(`Attachment with ID ${id} not found`)
      }

      // Remover arquivo do R2
      await this.r2Service.deleteFile(attachment.key)

      // Remover registro do banco de dados
      await this.prisma.attachment.delete({
        where: { id },
      })

      this.logger.log(`Attachment deleted with ID: ${id}`)
    } catch (error) {
      this.logger.error('Error deleting attachment:', error)
      throw error
    }
  }
}
