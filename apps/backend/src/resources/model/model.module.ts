import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { ModelController } from './model.controller'
import { ModelService } from './model.service'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Module({
  imports: [DatabaseModule],
  controllers: [ModelController],
  providers: [ModelService, JwtService, UsersService],
})
export class ModelModule {}
