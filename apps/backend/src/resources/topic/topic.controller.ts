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
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { TopicService } from './topic.service'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { UpdateTopicDto } from './dto/update-topic.dto'
import { CreateTopicDto } from './dto/create-topic.dto'

@Controller('/topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTopicOptions() {
    return await this.topicService.getTopicOptions()
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createTopic(@Body() { title }: CreateTopicDto) {
    return await this.topicService.createTopic({
      title,
    })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteTopic(@Param('id') id: string) {
    return await this.topicService.deleteTopic({
      id,
    })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateTopic(
    @Param('id') id: string,
    @Body() { title }: UpdateTopicDto,
  ) {
    return await this.topicService.updateTopic({
      id,
      title,
    })
  }
}
