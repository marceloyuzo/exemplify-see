import { Module } from '@nestjs/common'
import { AttachmentsService } from './attachment.service'
import { PrismaService } from 'src/database/services/prisma.service'
import { DatabaseModule } from 'src/database/database.module'
import { R2Service } from 'src/storage/r2.service'

@Module({
  imports: [DatabaseModule],
  providers: [AttachmentsService, PrismaService, R2Service],
  exports: [AttachmentsService],
})
export class AttachmentModule {}
