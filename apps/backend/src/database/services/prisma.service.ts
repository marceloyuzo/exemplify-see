import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  }

  async onModuleInit() {
    await this.connectWithRetry()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  // Reconexão automática
  private async connectWithRetry(retries = 5, delayMs = 2000): Promise<void> {
    for (let i = 0; i < retries; i++) {
      try {
        await this.$connect()
        this.logger.log('Prisma conectado com sucesso')
        return
      } catch (err) {
        this.logger.warn(`Erro ao conectar Prisma (tentativa ${i + 1}): ${err}`)
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
    throw new Error('Não foi possível conectar ao banco após várias tentativas')
  }
}
