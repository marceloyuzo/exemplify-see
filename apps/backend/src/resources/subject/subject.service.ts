import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/services/prisma.service'

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async getSubjectOptions() {
    return await this.prisma.subject.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  }
}
