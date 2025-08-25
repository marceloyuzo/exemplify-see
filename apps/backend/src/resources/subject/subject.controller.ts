import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { SubjectService } from './subject.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateSubjectDto } from './dto/create-subject.dto'
import { UpdateSubjectDto } from './dto/update-subject.dto'

@Controller('/subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getSubjectOptions() {
    return await this.subjectService.getSubjectOptions()
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createSubject(@Body() { title }: CreateSubjectDto) {
    return await this.subjectService.createSubject({
      title,
    })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteSubject(@Param('id') id: string) {
    return await this.subjectService.deleteSubject({
      id,
    })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateSubject(
    @Param('id') id: string,
    @Body() { title }: UpdateSubjectDto,
  ) {
    return await this.subjectService.updateSubject({
      id,
      title,
    })
  }
}
