import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { ExampleService } from './example.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { User } from '@prisma/client'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateExampleDto } from './dto/create-example.dto'
import { FilesInterceptor } from '@nestjs/platform-express'
import { MulterFile } from '../attachment/attachment.service'
import { UpdateExampleDto } from './dto/update-example.dto'

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
  @UseInterceptors(FilesInterceptor('files', 10))
  async createExample(
    @Request() req: Request & { user: User },
    @Body()
    createExampleDto: CreateExampleDto,
    @UploadedFiles() files: MulterFile[],
  ) {
    const user = req.user

    return await this.exampleService.createExample({
      title: createExampleDto.title,
      description: createExampleDto.description,
      references: createExampleDto.references,
      exampleType: createExampleDto.exampleType,
      modelsId: createExampleDto.modelsId,
      topicId: createExampleDto.topicId,
      authorId: user.id,
      files,
    })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 10))
  async updateExample(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
    @Body() updateExampleDto: UpdateExampleDto,
    @UploadedFiles() files: MulterFile[],
  ) {
    const user = req.user

    return await this.exampleService.updateExample({
      userId: user.id,
      id,
      title: updateExampleDto.title,
      description: updateExampleDto.description,
      references: updateExampleDto.references,
      exampleType: updateExampleDto.exampleType,
      modelsId: updateExampleDto.modelsId,
      topicId: updateExampleDto.topicId,
      files,
      removeAttachmentIds: updateExampleDto.removeAttachmentIds,
    })
  }
}
