import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { TopicService } from './topic.service'

@Controller('/topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTopicOptions() {
    return await this.topicService.getTopicOptions()
  }
}
