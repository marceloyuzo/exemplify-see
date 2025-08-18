import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { QuestionService } from './question.service'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { AdminGuard } from 'src/common/guards/admin.guard'
import { CreateQuestionDto } from './dto/create-question-dto'
import { EditQuestionDTO } from './dto/edfit-question-dto'

@Controller('/question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async create(
    @Body()
    {
      axisId,
      optionA,
      optionB,
      title,
      parentTransitionId,
      stepsA,
      stepsB,
    }: CreateQuestionDto,
  ) {
    return await this.questionService.createQuestion({
      axisId,
      optionA,
      optionB,
      title,
      parentTransitionId,
      stepsA,
      stepsB,
    })
  }

  @Get('')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async find(@Query('axisId') axisId: string) {
    return await this.questionService.findQuestionsByAxisId({
      axisId,
    })
  }

  @Get('/question-root')
  @UseGuards(JwtAuthGuard)
  async findFirstQuestion(@Query('axisId') axisId: string) {
    return await this.questionService.findFirstQuestion({
      axisId,
    })
  }

  @Get('/question-next')
  @UseGuards(JwtAuthGuard)
  async findNextQuestion(@Query('answerId') answerId: string) {
    return await this.questionService.findNextQuestion({
      answerId,
    })
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async get(@Param('id') id: string) {
    return await this.questionService.findQuestionDetail({
      questionId: id,
    })
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async patch(
    @Param('id') id: string,
    @Body()
    {
      optionIdA,
      optionIdB,
      optionValueA,
      optionValueB,
      stepsA,
      stepsB,
      title,
    }: EditQuestionDTO,
  ) {
    return await this.questionService.patchQuestion({
      questionId: id,
      optionIdA,
      optionIdB,
      optionValueA,
      optionValueB,
      stepsA,
      stepsB,
      title,
    })
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async remove(@Param('id') id: string) {
    return await this.questionService.deleteQuestionCascade({
      questionId: id,
    })
  }
}
