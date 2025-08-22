import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { TopicController } from './topic.controller'
import { TopicService } from './topic.service'

@Module({
  imports: [DatabaseModule],
  controllers: [TopicController],
  providers: [TopicService, JwtService, UsersService],
})
export class TopicModule {}
