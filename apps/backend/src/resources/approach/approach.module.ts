import { Module } from '@nestjs/common'
import { ApproachController } from './approach.controller'
import { ApproachService } from './approach.service'
import { DatabaseModule } from 'src/database/database.module'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ApproachController],
  providers: [ApproachService, JwtService, UsersService],
})
export class ApproachModule {}
