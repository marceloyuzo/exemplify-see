import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ExampleService } from './example.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { User } from '@prisma/client'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateExampleDto } from './dto/create-example.dto'

@Controller('/example')
export class ExampleController {
  constructor(private exampleService: ExampleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findExamples(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
    @Query('exampleName') exampleName?: string,
    @Query('exampleType') exampleType?: 'correct' | 'erroneous',
    @Query('topicId') topicId?: string,
  ) {
    return await this.exampleService.findManyExamples({
      page: Number(page),
      perPage: Number(perPage),
      orderBy,
      topicId,
      exampleName,
      exampleType,
      admin: false,
    })
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findExamplesAdmin(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
    @Query('exampleName') exampleName?: string,
    @Query('exampleType') exampleType?: 'correct' | 'erroneous',
    @Query('topicId') topicId?: string,
  ) {
    return await this.exampleService.findManyExamples({
      page: Number(page),
      perPage: Number(perPage),
      orderBy,
      topicId,
      exampleName,
      exampleType,
      admin: true,
    })
  }

  @Post('/:id/approve')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async approveExample(@Param('id') id: string) {
    return await this.exampleService.approveExample({
      id,
    })
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteExample(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    const user = req.user

    return await this.exampleService.deleteExample({
      exampleId: id,
      role: user.role,
      userId: user.id,
    })
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getExampleDetailed(@Param('id') id: string) {
    return await this.exampleService.getDetailedExample({
      exampleId: id,
    })
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createExample(
    @Request() req: Request & { user: User },
    @Body()
    {
      title,
      description,
      references,
      exampleType,
      modelsId,
      topicId,
    }: CreateExampleDto,
  ) {
    const user = req.user

    const referenceStrings = references.map((r) => r.value || '')

    return await this.exampleService.createExample({
      title,
      description,
      references: referenceStrings,
      exampleType,
      modelsId,
      topicId,
      authorId: user.id,
    })
  }
}
