import { Controller, Get, UseGuards } from '@nestjs/common'
import { SubjectService } from './subject.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@Controller('/subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubjectOptions() {
    return await this.subjectService.getSubjectOptions()
  }
}
