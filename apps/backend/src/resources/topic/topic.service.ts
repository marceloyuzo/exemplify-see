import { Injectable, NotFoundException } from '@nestjs/common'
import { Topic } from '@prisma/client'
import { PrismaService } from 'src/database/services/prisma.service'

interface CreateTopicProps {
  title: string
}

interface DeleteTopicProps {
  id: string
}

interface UpdateTopicProps {
  id: string
  title: string
}

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  async getTopicOptions() {
    return await this.prisma.topic.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    })
  }

  async createTopic({ title }: CreateTopicProps) {
    const topic = await this.prisma.topic.create({
      data: { title },
    })

    return topic
  }

  async deleteTopic({ id }: DeleteTopicProps) {
    const isTopicExists = await this.prisma.topic.findUnique({
      where: {
        id,
      },
    })

    if (!isTopicExists) {
      throw new NotFoundException('Não existe um tema com esse identificador.')
    }

    await this.prisma.topic.delete({
      where: {
        id,
      },
    })
  }

  async updateTopic({ id, title }: UpdateTopicProps) {
    const isTopicExists = await this.prisma.topic.findUnique({
      where: {
        id,
      },
    })

    if (!isTopicExists) {
      throw new NotFoundException('Não existe um tema com esse identificador.')
    }

    const topic = await this.prisma.topic.update({
      where: {
        id,
      },
      data: {
        title,
      },
    })

    return topic
  }

  async findById(id: string): Promise<Topic | null> {
    const topic = await this.prisma.topic.findUnique({
      where: {
        id,
      },
    })

    return topic
  }
}
