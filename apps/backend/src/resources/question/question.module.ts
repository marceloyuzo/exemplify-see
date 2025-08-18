import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { StepService } from '../step/step.service'

@Module({
  imports: [DatabaseModule],
  controllers: [QuestionController],
  providers: [QuestionService, StepService, JwtService, UsersService],
})
export class QuestionModule {}
