import { Injectable, Logger } from '@nestjs/common'
import { Prisma, User } from 'generated/prisma'
import { PrismaService } from 'src/database/services/prisma.service'
import { CreateUserDto } from './dto/create-user-dto'
import { EditUserDto } from './dto/edit-user-dto'

interface FindAllParams {
  page: number
  perPage: number
  name?: string
  role?: 'user' | 'admin'
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)
  constructor(private prisma: PrismaService) {}

  async create({
    email,
    firebaseUid,
    name,
    photoURL,
  }: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email,
        firebaseUid,
        name,
        photoURL,
        role: 'user',
      },
    })

    return user
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        firebaseUid,
      },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    })
  }

  async findManyUsers(params: FindAllParams) {
    const { page, perPage, name, role } = params

    const where: Prisma.UserWhereInput = {}
    if (name) {
      where.name = { contains: name, mode: 'insensitive' }
    }
    if (role) {
      where.role = role
    }

    const total = await this.prisma.user.count({ where })

    // Busca paginada
    const users = await this.prisma.user.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
    })

    return {
      data: users,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async update(id: string, userData: Partial<EditUserDto>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        updatedAt: new Date(),
      },
    })

    return user
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }
}
