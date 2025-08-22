import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common'
import { LessonPlanService } from './lesson-plan.service'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { User } from 'generated/prisma'

@Controller('/lesson-plan')
@UseGuards(JwtAuthGuard)
export class LessonPlanController {
  constructor(private lessonPlanService: LessonPlanService) {}

  @Post()
  async create(
    @Body() createLessonPlanDto: CreateLessonPlanDto,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id
    return await this.lessonPlanService.createLessonPlan(
      userId,
      createLessonPlanDto,
    )
  }

  @Get('/highlights')
  async getHighlightsLessonPlans(
    @Query('myRepository') myRepository: boolean,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id

    return await this.lessonPlanService.getHighlightsLessonPlans({
      userId,
      myRepository,
    })
  }

  @Get('/:id')
  async getLessonPlanById(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    const userId = req.user.id
    return await this.lessonPlanService.getLessonPlanById(id, userId)
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findApproaches(
    @Request() req: Request & { user: User },
    @Query('page') page: string = '1',
    @Query('perPage') perPage: string = '10',
    @Query('orderBy') orderBy: 'asc' | 'desc' = 'desc',
    @Query('lessonPlanName') lessonPlanName?: string,
    @Query('myLessons') myLessons?: boolean,
    @Query('subjectId') subjectId?: string,
    @Query('topicId') topicId?: string,
    @Query('complexity') complexity?: 'beginner' | 'intermediate',
    @Query('example') example?: 'correct' | 'erroneous',
  ) {
    const userId = req.user.id

    return await this.lessonPlanService.findManyLessonsPlan({
      userId,
      page: Number(page),
      perPage: Number(perPage),
      orderBy,
      myLessons,
      lessonPlanName,
      subjectId,
      topicId,
      complexity,
      example,
    })
  }
}
