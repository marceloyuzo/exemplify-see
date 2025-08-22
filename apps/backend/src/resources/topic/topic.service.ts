import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/services/prisma.service'

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  async getTopicOptions() {
    return await this.prisma.topic.findMany({
      select: {
        id: true,
        title: true,
      },
    })
  }
}
