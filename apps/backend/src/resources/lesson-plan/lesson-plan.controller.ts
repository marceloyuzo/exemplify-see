import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
  Query,
  Patch,
  Delete,
} from '@nestjs/common'
import { LessonPlanService } from './lesson-plan.service'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { User } from '@prisma/client'
import { UpdateLessonPlanDto } from './dto/update-lesson-plan.dto'

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

  @Patch('/:id')
  async updateLessonPlan(
    @Param('id') id: string,
    @Body() body: UpdateLessonPlanDto,
  ) {
    return await this.lessonPlanService.updateLessonPlan(id, {
      approachId: body.approachId,
      axes: body.axes,
      isPublic: body.isPublic,
      title: body.title,
      complexity: body.complexity,
      description: body.description,
      example: body.example,
      subjectId: body.subjectId,
      topicId: body.topicId,
      contents: body.contents,
      materials: body.materials,
      modality: body.modality,
      workload: body.workload,
      year: body.year,
      priorKnowledge: body.priorKnowledge,
    })
  }

  @Delete('/:id')
  async deleteLessonPlan(
    @Param('id') id: string,
    @Request() req: Request & { user: User },
  ) {
    const user = req.user

    return await this.lessonPlanService.deleteLessonPlan({
      user,
      lessonPlanId: id,
    })
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

  @Get('/:id/pdf')
  async getInformationToPdf(@Param('id') id: string) {
    return await this.lessonPlanService.getInformationsToPdf(id)
  }
}
