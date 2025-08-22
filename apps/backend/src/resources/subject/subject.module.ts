import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { SubjectService } from './subject.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { SubjectController } from './subject.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [SubjectController],
  providers: [SubjectService, JwtService, UsersService],
})
export class SubjectModule {}
