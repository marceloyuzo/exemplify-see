import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { RatingController } from './rating.controller'
import { RatingService } from './rating.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Module({
  imports: [DatabaseModule],
  controllers: [RatingController],
  providers: [RatingService, JwtService, UsersService],
})
export class RatingModule {}
