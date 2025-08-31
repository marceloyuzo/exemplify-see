import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { PrismaService } from 'src/database/services/prisma.service'

interface RateExampleProps {
  exampleId?: string
  lessonPlanId?: string
  userId: string
  rate: number
  comment?: string
}

interface FindRatingsProps {
  exampleId: string
  page: number
  perPage: number
}

interface DeleteRatingProps {
  userId: string
  ratingId: string
}

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async rating({
    comment,
    exampleId,
    lessonPlanId,
    rate,
    userId,
  }: RateExampleProps) {
    if (exampleId && lessonPlanId) {
      throw new ConflictException('Payload incorreto.')
    }

    if (rate < 1 || rate > 10) {
      throw new ConflictException('A avaliação aceita apenas de 1 a 10.')
    }

    if (exampleId) {
      const isExampleExists = await this.prisma.example.findUnique({
        where: {
          id: exampleId,
        },
      })

      if (!isExampleExists) {
        throw new NotFoundException(
          'Não existe um exemplo com esse identificador.',
        )
      }

      const isUserAlreadyRated = await this.prisma.rating.findUnique({
        where: {
          userId_exampleId: {
            exampleId,
            userId,
          },
        },
      })

      if (isUserAlreadyRated) {
        throw new ConflictException(
          'Apenas uma avaliação por usuário em um exemplo.',
        )
      }

      const rating = await this.prisma.rating.create({
        data: {
          rate,
          comment,
          exampleId,
          userId,
        },
      })

      return rating
    }

    if (lessonPlanId) {
      const isLessonPlanExists = await this.prisma.lessonPlan.findUnique({
        where: {
          id: lessonPlanId,
        },
      })

      if (!isLessonPlanExists) {
        throw new NotFoundException(
          'Não existe um plano de aula com esse identificador.',
        )
      }

      const isUserAlreadyRated = await this.prisma.rating.findUnique({
        where: {
          userId_lessonPlanId: {
            lessonPlanId,
            userId,
          },
        },
      })

      if (isUserAlreadyRated) {
        throw new ConflictException(
          'Apenas uma avaliação por usuário em um plano de aula.',
        )
      }

      const rating = await this.prisma.rating.create({
        data: {
          rate,
          comment,
          lessonPlanId,
          userId,
        },
      })

      return rating
    }
  }

  async findRatings({ exampleId, page, perPage }: FindRatingsProps) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        exampleId,
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rate: true,
        comment: true,
        user: {
          select: {
            id: true,
            name: true,
            photoURL: true,
          },
        },
        createdAt: true,
      },
    })

    const total = await this.prisma.rating.count({
      where: {
        exampleId,
      },
    })

    return {
      data: ratings,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async deleteRating({ ratingId, userId }: DeleteRatingProps) {
    const isRatingExists = await this.prisma.rating.findUnique({
      where: {
        id: ratingId,
      },
    })

    if (!isRatingExists) {
      throw new NotFoundException(
        'Não existe uma avaliação com esse identificador.',
      )
    }

    if (isRatingExists.userId !== userId) {
      throw new UnauthorizedException(
        'Você não tem permissão para realizar essa operação.',
      )
    }

    const ratingDeleted = await this.prisma.rating.delete({
      where: {
        id: ratingId,
      },
    })

    return ratingDeleted
  }
}
