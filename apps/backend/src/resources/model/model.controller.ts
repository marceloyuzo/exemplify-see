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
import { ModelService } from './model.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateModelDto } from './dto/create-model.dto'
import { UpdateModelDto } from './dto/update-mode.dto'

@Controller('/model')
export class ModelController {
  constructor(private modelService: ModelService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getModelOptions() {
    return await this.modelService.getModelOptions()
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createModel(@Body() { title }: CreateModelDto) {
    return await this.modelService.createModel({
      title,
    })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteModel(@Param('id') id: string) {
    return await this.modelService.deleteModel({
      id,
    })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateModel(
    @Param('id') id: string,
    @Body() { title }: UpdateModelDto,
  ) {
    return await this.modelService.updateModel({
      id,
      title,
    })
  }
}
