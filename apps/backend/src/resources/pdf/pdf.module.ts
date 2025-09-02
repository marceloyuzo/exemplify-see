// pdf.module.ts
import { Module } from '@nestjs/common'
import { PdfService } from './pdf.service'
import { PdfController } from './pdf.controller'
import { ApproachService } from '../approach/approach.service'
import { TopicService } from '../topic/topic.service'
import { SubjectService } from '../subject/subject.service'
import { AxisService } from '../axis/axis.service'
import { PrismaService } from 'src/database/services/prisma.service'

@Module({
  controllers: [PdfController],
  providers: [
    PdfService,
    ApproachService,
    TopicService,
    SubjectService,
    AxisService,
    PrismaService,
  ],
})
export class PdfModule {}
