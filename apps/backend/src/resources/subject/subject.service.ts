import { Injectable, NotFoundException } from '@nestjs/common'
import { Subject } from '@prisma/client'
import { PrismaService } from 'src/database/services/prisma.service'

interface CreateSubjectProps {
  title: string
}

interface DeleteSubjectProps {
  id: string
}

interface UpdateSubjectProps {
  id: string
  title: string
}

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) {}

  async getSubjectOptions() {
    return await this.prisma.subject.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    })
  }

  async createSubject({ title }: CreateSubjectProps) {
    const subject = await this.prisma.subject.create({
      data: { title },
    })

    return subject
  }

  async deleteSubject({ id }: DeleteSubjectProps) {
    const isSubjectExists = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    })

    if (!isSubjectExists) {
      throw new NotFoundException(
        'Não existe uma disciplina com esse identificador.',
      )
    }

    await this.prisma.subject.delete({
      where: {
        id,
      },
    })
  }

  async updateSubject({ id, title }: UpdateSubjectProps) {
    const isSubjectExists = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    })

    if (!isSubjectExists) {
      throw new NotFoundException(
        'Não existe uma disciplina com esse identificador.',
      )
    }

    const subject = await this.prisma.subject.update({
      where: {
        id,
      },
      data: {
        title,
      },
    })

    return subject
  }

  async findById(id: string): Promise<Subject | null> {
    const subject = await this.prisma.subject.findUnique({
      where: {
        id,
      },
    })

    return subject
  }
}
