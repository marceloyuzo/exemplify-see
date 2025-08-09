import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { DatabaseModule } from 'src/database/database.module'
import { JwtService } from '@nestjs/jwt'

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}
