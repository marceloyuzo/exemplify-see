import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { AxisService } from './axis.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateAxisDto } from './dto/create-axis-dto'
import { EditAxisDto } from './dto/edit-axis-dto'

@Controller('/axis')
export class AxisController {
  constructor(private axisService: AxisService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(@Body() { title, approachId }: CreateAxisDto) {
    return await this.axisService.createAxis({
      title,
      approachId,
    })
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async delete(@Param('id') id: string) {
    await this.axisService.deleteAxis({
      id,
    })
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async get(@Param('id') id: string) {
    return await this.axisService.getAxis({
      id,
    })
  }

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAxisList(@Query('approachId') approachId: string) {
    return await this.axisService.getAxisList({
      approachId,
    })
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async patch(@Param('id') id: string, @Body() { title }: EditAxisDto) {
    return await this.axisService.updateAxis({
      id,
      title,
    })
  }
}
