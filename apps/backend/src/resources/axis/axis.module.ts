import { Module } from '@nestjs/common'
import { DatabaseModule } from 'src/database/database.module'
import { AxisService } from './axis.service'
import { AxisController } from './axis.controller'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'

@Module({
  imports: [DatabaseModule],
  controllers: [AxisController],
  providers: [AxisService, JwtService, UsersService],
})
export class AxisModule {}
