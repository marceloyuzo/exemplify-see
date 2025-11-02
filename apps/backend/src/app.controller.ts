import { Controller, Get } from '@nestjs/common'

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello(): string {
    const now = new Date()
    const formatted = now.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
    })
    return `${formatted}`
  }
}
