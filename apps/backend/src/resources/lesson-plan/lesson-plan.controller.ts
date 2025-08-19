import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common'
import { LessonPlanService } from './lesson-plan.service'
import { CreateLessonPlanDto } from './dto/create-lesson-plan.dto'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'

@Controller('/lesson-plan')
@UseGuards(JwtAuthGuard)
export class LessonPlanController {
  constructor(private lessonPlanService: LessonPlanService) {}

  @Post()
  async create(
    @Body() createLessonPlanDto: CreateLessonPlanDto,
    @Request() req: any,
  ) {
    const userId = req.user.id
    return await this.lessonPlanService.createLessonPlan(
      userId,
      createLessonPlanDto,
    )
  }

  @Get()
  async getLessonPlansByUser(@Request() req: any) {
    const userId = req.user.firebaseUid
    return await this.lessonPlanService.getLessonPlansByUser(userId)
  }

  @Get('/:id')
  async getLessonPlanById(@Param('id') id: string, @Request() req: any) {
    const userId = req.user.firebaseUid
    return await this.lessonPlanService.getLessonPlanById(id, userId)
  }
}
