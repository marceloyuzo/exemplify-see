import { Injectable, Logger } from '@nestjs/common'
import { User } from 'generated/prisma'
import { PrismaService } from 'src/database/services/prisma.service'
import { CreateUserDto } from './dto/create-user-dto'

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

  async update(id: string, userData: Partial<CreateUserDto>): Promise<User> {
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
