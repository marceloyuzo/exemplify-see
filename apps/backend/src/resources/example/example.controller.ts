import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common'
import { ExampleService } from './example.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { User } from '@prisma/client'

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
    })
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
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
}
