import { Module } from '@nestjs/common'
import { LessonPlanController } from './lesson-plan.controller'
import { LessonPlanService } from './lesson-plan.service'
import { DatabaseModule } from 'src/database/database.module'
import { UsersModule } from '../users/users.module'
import { AuthModule } from '../auth/auth.module'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule],
  controllers: [LessonPlanController],
  providers: [LessonPlanService, UsersService, JwtService],
  exports: [LessonPlanService],
})
export class LessonPlanModule {}
