import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApproachService } from './approach.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateApproachDto } from './dto/create-approach-dto'
import { EditApproachDto } from './dto/edit-approach-dto'

@Controller('/approach')
export class ApproachController {
  private readonly logger = new Logger(ApproachController.name)

  constructor(private approachService: ApproachService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() { title }: CreateApproachDto) {
    return await this.approachService.createApproach({
      title,
    })
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getApproachDetails(@Param('id') id: string) {
    return await this.approachService.getApproachDetails({
      id,
    })
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    return await this.approachService.deleteApproach({
      id,
    })
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async edit(@Param('id') id: string, @Body() { title }: EditApproachDto) {
    return await this.approachService.editApproach({
      id,
      title
    })
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async findApproaches(
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('approachName') approachName?: string,
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
  ) {
    return await this.approachService.findManyApproaches({
      page: Number(page),
      perPage: Number(perPage),
      orderBy,
      approachName,
    })
  }
}
